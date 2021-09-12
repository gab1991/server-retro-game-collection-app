const express = require('express');

const { getGameDetails, getGameScreenshots, getGamesForPlatforms } = require('../controllers/ragwController');

const router = express.Router();

// Endpoints
router.get('/gameDetails/:slug', getGameDetails);

router.get('/screenshots/:slug', getGameScreenshots);

router.get('/gamesForPlatform?:searchStr', getGamesForPlatforms);

module.exports = router;
