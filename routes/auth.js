const express = require('express');

const router = express.Router();
const { verification } = require('../midllewares');
const { signUp, signIn, checkCredentials } = require('../controllers/authController');

// Endpoints
router.post('/sign_up', signUp);

router.post('/sign_in', signIn);

router.post('/check_credentials', verification, checkCredentials);

module.exports = router;
