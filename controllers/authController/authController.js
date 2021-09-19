const bcrypt = require('bcrypt');
const Profile = require('../../models/Profile.js');
const { issueToken } = require('./issueTokken');
const { revokeToken } = require('./revokeToken');
const asyncErrorCatcher = require('../../utils/asyncErrorCatcher');

const signUp = asyncErrorCatcher(async (req, res) => {
  const existingUser = await Profile.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

  if (existingUser) {
    if (existingUser.username === req.body.username) {
      return res.status(400).send({ err_message: 'This username is already taken', field: 'username' });
    }
    if (existingUser.email === req.body.email) {
      return res.status(400).send({ err_message: 'This email is already taken', field: 'email' });
    }
    return res.status(400).send({ err_message: 'This user already exists', field: 'unknown' });
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const profile = new Profile({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
    owned_list: { platforms: [] },
    wish_list: { platforms: [] },
  });

  await profile.save();

  issueToken(profile._id, res);

  return res.send({ status: 'success' });
});

const signIn = asyncErrorCatcher(async (req, res) => {
  // check if this user exists
  const user = await Profile.findOne({ username: req.body.username }).select('password');

  if (!user) {
    return res.status(400).send({ err_message: "Username doesn't exist ", field: 'username' });
  }

  // Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) {
    return res.status(400).send({
      err_message: 'Username or password is not correct',
      field: 'password',
    });
  }

  issueToken(user._id, res);

  return res.send({ status: 'success', username: req.body.username });
});

const checkCredentials = async (req, res) => {
  try {
    const { profile } = req;
    return res.send({ status: 'success', username: profile.username });
  } catch (err) {
    return res.status(400).send({ err_message: err });
  }
};

const logout = async (req, res) => {
  try {
    revokeToken(res);
    return res.send({ status: 'success' });
  } catch (err) {
    return res.status(400).send({ err_message: err });
  }
};

module.exports = {
  signUp,
  signIn,
  logout,
  checkCredentials,
};
