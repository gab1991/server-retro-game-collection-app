const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {
  signUpValidation,
  signInValidation,
  divideStr
} = require('../validation.js');
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
      field: divided[0]
    });
  }
  // check if this user already exists
  const userEsxists = await User.findOne({ username: req.body.username });
  const emailEsxists = await User.findOne({ email: req.body.email });
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

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword
  });
  try {
    const savedUser = await user.save();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'origin, content-type, accept'
    );
    res.send({ user_id: user._id });
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'origin, content-type, accept'
    );
    res.status(400).send(err);
  }
});

router.post('/sign_in', async (req, res) => {
  //validate
  const { error } = signInValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if this user exists
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(400).send({ err_message: 'Username doesn" exist ' });

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res
      .status(400)
      .send({ err_message: 'Username or password is not correct' });

  // Creating validation token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  res.header('auth-token', token).send(token);
  console.log(res);
  // res.send('Log In');
});

module.exports = router;
