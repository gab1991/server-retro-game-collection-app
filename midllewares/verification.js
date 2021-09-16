const jwt = require('jsonwebtoken');

const verification = (req, res, next) => {
  const token = req.cookies.authorization;

  if (!token) {
    return res.status(401).json({ access_denied: 'token is not provieded' });
  }

  try {
    const { _id } = jwt.verify(token, process.env.TOKEN_SECRET);
    req.verifiedUserId = _id;
    return next();
  } catch (err) {
    return res.status(400).json({ access_denied: 'Access Denied' });
  }
};

module.exports = { verification };
