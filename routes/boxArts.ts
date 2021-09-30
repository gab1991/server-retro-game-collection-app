import express from 'express';
import { getBoxArt } from 'controllers/boxArtController';

const router = express.Router();

// Endpoints
router.get('/:platform/:gameName', getBoxArt);

export default router;
