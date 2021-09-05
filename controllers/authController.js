const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signUpValidation, signInValidation, divideStr } = require('../validation.js');
const Profile = require('../models/Profile.js');

const signUp = async (req, res) => {
  const { error } = signUpValidation(req.body);

  if (error) {
    const { message } = error.details[0];
    const divided = divideStr(message);

    return res.status(400).send({
      err_message: divided[1],
      field: divided[0],
    });
  }
  // check if this user already exists
  const userEsxists = await Profile.findOne({ username: req.body.username });
  const emailEsxists = await Profile.findOne({ email: req.body.email });

  if (userEsxists) {
    return res.status(400).send({ err_message: 'This username already exists', field: 'username' });
  }
  if (emailEsxists) {
    return res.status(400).send({ err_message: 'This email already exists', field: 'email' });
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

  try {
    await profile.save();
    return res.send({ user_id: profile._id });
  } catch (err) {
    return res.status(400).send(err);
  }
};

const signIn = async (req, res) => {
  // validate
  const { error } = signInValidation(req.body);

  if (error) {
    const { message } = error.details[0];
    const divided = divideStr(message);
    return res.status(400).send({
      err_message: divided[1],
      field: divided[0],
    });
  }
  // check if this user exists
  const user = await Profile.findOne({ username: req.body.username });
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

  // Creating validation token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  return res.send({ success: 'Log In', username: req.body.username, token });
};

const checkCredentials = async (req, res) => {
  try {
    const { username } = req.body;

    // token verification
    const { _id } = req.verifiedUserData;
    // check if this user exists
    const user = await Profile.findOne({ _id });
    const { username: dbUsername } = user;

    if (dbUsername === username) {
      return res.send({ success: 'credentials are valid' });
    }
    return res.status(400).send({ err_message: 'local username is different than one in db' });
  } catch (err) {
    return res.status(400).send({ err_message: err });
  }
};

module.exports = {
  signUp,
  signIn,
  checkCredentials,
};
