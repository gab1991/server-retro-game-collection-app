const express = require('express');
const router = express.Router();
const verify = require('./verifyToken.js');

router.get('/', verify.verifyToken, (req, res) => {
  res.send(req.username);
});

module.exports = router;
