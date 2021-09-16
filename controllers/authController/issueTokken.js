const jwt = require('jsonwebtoken');

const isDevelopment = process.env.NODE_ENV === 'development';

const issueToken = (id, res) => {
  const token = jwt.sign({ _id: id }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRE });

  res.cookie('authorization', token, {
    maxAge: process.env.TOKEN_COOKIE_MAX_AGE,
    httpOnly: true, // prevent accessing cookie from js
    sameSite: isDevelopment ? 'Lax' : 'Strict',
    // secure: true  at first need to endable https
  });
};

module.exports = { issueToken };
