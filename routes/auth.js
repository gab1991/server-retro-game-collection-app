const express = require('express');

const router = express.Router();
const { verification, fetchVerifiedProfile } = require('../midllewares');
const { signUp, signIn, checkCredentials } = require('../controllers/authController/authController');

// Endpoints
router.post('/sign_up', signUp);

router.post('/sign_in', signIn);

router.post('/check_credentials', verification, fetchVerifiedProfile, checkCredentials);

module.exports = router;
