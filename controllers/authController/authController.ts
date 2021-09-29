import bcrypt from 'bcrypt';

import { Profile } from '../../models/Profile';
import { issueToken } from './issueTokken';
import { revokeToken } from './revokeToken';
import { asyncErrorCatcher } from '../../utils/asyncErrorCatcher';
import { TSignInHandler, TSignUpHandler } from './types';

export const signUp = asyncErrorCatcher<TSignUpHandler>(async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = await Profile.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    if (existingUser.username === username) {
      return res.status(400).send({ err_message: 'This username is already taken', field: 'username', status: 'fail' });
    }
    if (existingUser.email === email) {
      return res.status(400).send({ err_message: 'This email is already taken', field: 'email', status: 'fail' });
    }
    return res.status(400).send({ err_message: 'This user already exists', field: 'unknown', status: 'fail' });
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

  return res.send({ status: 'success' });
});

export const signIn = asyncErrorCatcher<TSignInHandler>(async (req, res) => {
  const { password, username } = req.body;

  const existingUser = await Profile.findOne({ username }).select('password');

  if (!existingUser) {
    return res.status(400).send({ err_message: "Username doesn't exist ", field: 'username', status: 'fail' });
  }

  // pass validation
  const validPass = await bcrypt.compare(password, existingUser.password);

  if (!validPass) {
    return res.status(400).send({
      err_message: 'Username or password is not correct',
      field: 'password',
      status: 'fail',
    });
  }

  issueToken(existingUser._id, res);

  return res.send({ status: 'success' });
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
