import express from 'express';
import {
  getProfile,
  getIsWatchedEbayCard,
  watchEbayCard,
  unWatchEbayCard,
  getGameWatchedCards,
  toggleEbaySection,
  addGame,
  removeGame,
  reorderGames,
} from 'controllers/profileController';
import { fetchVerifiedProfile, verification } from 'midllewares';

const router = express.Router();

// Route specific middlewares
router.use(verification, fetchVerifiedProfile);

// Endpoints
router.get('/', getProfile);

router.post('/games', addGame);

router.delete('/games', removeGame);

router.put('/games/reorder', reorderGames);

router.post('/ebayCards/:platform/:gameName/:ebayItemId', watchEbayCard);

router.delete('/ebayCards/:platform/:gameName/:ebayItemId', unWatchEbayCard);

router.get('/ebayCards/:platform/:gameName/watched', getGameWatchedCards);

router.get('/ebayCards/:platform/:gameName/:ebayItemId/isWatched', getIsWatchedEbayCard);

router.post('/toggleEbaySection', toggleEbaySection);

export default router;
