import express from 'express';
import { fetchVerifiedProfile, verification } from '../midllewares';

import {
  getProfile,
  getIsWatchedEbayCard,
  addEbayCard,
  removeEbayCard,
  getGameWatchedCards,
  toggleEbaySection,
  addGame,
  removeGame,
  reorderGames,
} from '../controllers/profileController/profileController';

const router = express.Router();

// Route specific middlewares
router.use(verification, fetchVerifiedProfile);

// Endpoints
router.get('/', getProfile);

router.post('/games', addGame);

router.delete('/games', removeGame);

router.put('/games/reorder', reorderGames);

router.post('/ebayCards', addEbayCard);

router.delete('/ebayCards', removeEbayCard);

router.get('/ebayCards/watched/:platform/:gameName', getGameWatchedCards);

router.get('/ebayCards/isWatched/:platform/:gameName/:ebayItemId', getIsWatchedEbayCard);

router.post('/toggleEbaySection', toggleEbaySection);

module.exports = router;
