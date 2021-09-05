const express = require('express');

const router = express.Router();
const verify = require('../tokenVerification/verifyToken.js');
const {
  getProfile,
  updateProfile,
  getIsWatchedEbayCard,
  addEbayCard,
  removeEbayCard,
  getGameWatchedCards,
  toggleEbaySection,
} = require('../controllers/profileController');

router.get('/', verify.verifyToken, getProfile);

router.post('/update', verify.verifyToken, updateProfile);

router.post('/isWatchedEbayCard', verify.verifyToken, getIsWatchedEbayCard);

router.post('/addEbayCard', verify.verifyToken, addEbayCard);

router.post('/removeEbayCard', verify.verifyToken, removeEbayCard);

router.get('/getGameWatchedCards/:platform/:gameName', verify.verifyToken, getGameWatchedCards);

router.post('/toggleEbaySection', verify.verifyToken, toggleEbaySection);

module.exports = router;
