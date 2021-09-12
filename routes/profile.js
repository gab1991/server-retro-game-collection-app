const express = require('express');
const { fetchVerifiedProfile } = require('../midllewares');

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

router.get('/', getProfile);

router.post('/games', fetchVerifiedProfile, addGame);

router.delete('/games', fetchVerifiedProfile, removeGame);

router.put('/games/reorder', fetchVerifiedProfile, reorderGames);

router.get('/ebayCards/isWatched/:platform/:gameName/:ebayItemId', fetchVerifiedProfile, getIsWatchedEbayCard);

router.post('/addEbayCard', addEbayCard);

router.post('/removeEbayCard', removeEbayCard);

router.get('/getGameWatchedCards/:platform/:gameName', getGameWatchedCards);

router.post('/toggleEbaySection', toggleEbaySection);

module.exports = router;
