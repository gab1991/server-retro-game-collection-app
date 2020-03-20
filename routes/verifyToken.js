const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.params.token;
  if (!token) return res.status(401).json('Access Denieid');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.username = verified;
    next();
  } catch (err) {
    res.status(400).json('Access Denied');
  }
};

module.exports.verifyToken = verifyToken;
