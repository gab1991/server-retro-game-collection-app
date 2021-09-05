const express = require('express');

const router = express.Router();

const { verifyToken } = require('../tokenVerification/verifyToken');
const { signUp, signIn, checkCredentials } = require('../controllers/authController');

router.post('/sign_up', signUp);

router.post('/sign_in', signIn);

router.post('/check_credentials', verifyToken, checkCredentials);

module.exports = router;
