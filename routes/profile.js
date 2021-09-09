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
} = require('../controllers/profileController');

router.get('/', getProfile);

router.get('/games/add', getProfile);

router.post('/update', updateProfile);

router.post('/isWatchedEbayCard', getIsWatchedEbayCard);

router.post('/addEbayCard', addEbayCard);

router.post('/removeEbayCard', removeEbayCard);

router.get('/getGameWatchedCards/:platform/:gameName', getGameWatchedCards);

router.post('/toggleEbaySection', toggleEbaySection);

module.exports = router;
