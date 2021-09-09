const express = require('express');

const router = express.Router();

const {
  getProfile,
  updateProfile,
  getIsWatchedEbayCard,
  addEbayCard,
  removeEbayCard,
  getGameWatchedCards,
  toggleEbaySection,
  addGame,
  fetchVerifiedProfile,
} = require('../controllers/profileController');

router.get('/', getProfile);

router.post('/games', fetchVerifiedProfile, addGame);

router.post('/update', updateProfile);

router.post('/isWatchedEbayCard', getIsWatchedEbayCard);

router.post('/addEbayCard', addEbayCard);

router.post('/removeEbayCard', removeEbayCard);

router.get('/getGameWatchedCards/:platform/:gameName', getGameWatchedCards);

router.post('/toggleEbaySection', toggleEbaySection);

module.exports = router;
