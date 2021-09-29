import express from 'express';
import { verification, fetchVerifiedProfile } from 'midllewares';
import { signUp, signIn, checkCredentials, logout } from '../controllers/authController/authController';

const router = express.Router();

// Endpoints
router.post('/sign_up', signUp);

router.post('/log_out', verification, logout);

router.post('/sign_in', signIn);

router.post('/check_credentials', verification, fetchVerifiedProfile, checkCredentials);

module.exports = router;
