import express from 'express';

import { getGameDetails, getGameScreenshots, getGamesForPlatforms } from 'controllers/rawgController';

const router = express.Router();

// Endpoints
router.get('/gameDetails/:slug', getGameDetails);

router.get('/screenshots/:slug', getGameScreenshots);

router.get('/gamesForPlatform?:searchStr', getGamesForPlatforms);

export default router;
