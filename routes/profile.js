const express = require('express');
const { fetchVerifiedProfile, verification } = require('../midllewares');

const router = express.Router();

const {
  getProfile,
  getIsWatchedEbayCard,
  addEbayCard,
  removeEbayCard,
  getGameWatchedCards,
  toggleEbaySection,
  addGame,
  removeGame,
  reorderGames,
} = require('../controllers/profileController/profileController');

// Route specific middlewares
router.use(verification, fetchVerifiedProfile);

// Endpoints
router.get('/', getProfile);

router.post('/games', addGame);

router.delete('/games', removeGame);

router.put('/games/reorder', reorderGames);

router.post('/ebayCards', addEbayCard);

router.delete('/ebayCards', removeEbayCard);

router.get('/ebayCards/isWatched/:platform/:gameName/:ebayItemId', getIsWatchedEbayCard);

router.get('/getGameWatchedCards/:platform/:gameName', getGameWatchedCards);

router.post('/toggleEbaySection', toggleEbaySection);

module.exports = router;
