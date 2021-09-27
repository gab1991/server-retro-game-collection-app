import bcrypt from 'bcrypt';

import Profile from '../../models/Profile';
import { issueToken } from './issueTokken';
import { revokeToken } from './revokeToken';
import { asyncErrorCatcher } from '../../utils/asyncErrorCatcher';

export const signUp = asyncErrorCatcher(async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = await Profile.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    if (existingUser.username === username) {
      res.status(400).send({ err_message: 'This username is already taken', field: 'username' });
      return;
    }
    if (existingUser.email === email) {
      res.status(400).send({ err_message: 'This email is already taken', field: 'email' });
      return;
    }
    res.status(400).send({ err_message: 'This user already exists', field: 'unknown' });
    return;
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const profile = new Profile({
    username,
    email,
    password: hashPassword,
    owned_list: { platforms: [] },
    wish_list: { platforms: [] },
  });

  await profile.save();

  issueToken(profile._id, res);

  res.send({ status: 'success' });
});

export const signIn = asyncErrorCatcher(async (req, res) => {
  // check if this user exists
  const user = await Profile.findOne({ username: req.body.username }).select('password');

  if (!user) {
    res.status(400).send({ err_message: "Username doesn't exist ", field: 'username' });
    return;
  }

  // Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) {
    res.status(400).send({
      err_message: 'Username or password is not correct',
      field: 'password',
    });
    return;
  }

  issueToken(user._id, res);

  res.send({ status: 'success', username: req.body.username });
});

export const checkCredentials = async (req, res) => {
  try {
    const { profile } = req;
    return res.send({ status: 'success', username: profile.username });
  } catch (err) {
    return res.status(400).send({ err_message: err });
  }
};

export const logout = async (req, res) => {
  try {
    revokeToken(res);
    return res.send({ status: 'success' });
  } catch (err) {
    return res.status(400).send({ err_message: err });
  }
};
