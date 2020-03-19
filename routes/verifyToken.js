const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) return res.status(401).send('Access Denieid');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.username = verified;
    next();
  } catch (err) {
    res.status(400).send('Access Denied');
  }
};

module.exports.verifyToken = verifyToken;
