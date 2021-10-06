import express from 'express';
import { getVideo } from 'controllers/youtubeController';

const router = express.Router();

// Endpoints
router.get('/:videoType/:platform/:gameName', getVideo);

export default router;
