const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile.js');
const {
  signUpValidation,
  signInValidation,
  divideStr,
} = require('../validation.js');
const { verifyToken } = require('../tokenVerification/verifyToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/sign_up', async (req, res) => {
  //validation of the given body
  const { error } = signUpValidation(req.body);

  if (error) {
    const message = error.details[0].message;
    const divided = divideStr(message);
    return res.status(400).send({
      err_message: divided[1],
      field: divided[0],
    });
  }
  // check if this user already exists
  const userEsxists = await Profile.findOne({ username: req.body.username });
  const emailEsxists = await Profile.findOne({ email: req.body.email });
  if (userEsxists)
    return res
      .status(400)
      .send({ err_message: 'This username already exists', field: 'username' });
  if (emailEsxists)
    return res
      .status(400)
      .send({ err_message: 'This email already exists', field: 'email' });

  //Hash passwords
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
    res.send({ user_id: profile._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/sign_in', async (req, res) => {
  //validate
  const { error } = signInValidation(req.body);

  if (error) {
    const message = error.details[0].message;
    const divided = divideStr(message);
    return res.status(400).send({
      err_message: divided[1],
      field: divided[0],
    });
  }
  // check if this user exists
  const user = await Profile.findOne({ username: req.body.username });
  if (!user)
    return res
      .status(400)
      .send({ err_message: `Username doesn't exist `, field: 'username' });

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send({
      err_message: 'Username or password is not correct',
      field: 'password',
    });

  // Creating validation token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  //res.header('access-control-allow-headers', 'auth-token');
  // console.log({ success: 'Log In', username: req.body.username, token: token });
  res.send({ success: 'Log In', username: req.body.username, token: token });
});

router.post('/check_credentials', verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);
    //token verification
    const { _id } = req.verifiedUserData;
    // check if this user exists
    const user = await Profile.findOne({ _id });
    const { username: dbUsername } = user;
    if (dbUsername === username) {
      res.send({ success: 'credentials are valid' });
    } else {
      return res
        .status(400)
        .send({ err_message: 'local username is different than one in db' });
    }
  } catch (err) {
    return res.status(400).send({ err_message: err });
  }
});

module.exports = router;
