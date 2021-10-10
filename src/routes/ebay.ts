import express from 'express';
import { findByKeywords, findSingleItem, getShippingCost } from 'controllers/ebyaController/ebayController';

const router = express.Router();

// Endpoints
router.get('/searchList/:platform/:gameName/:sortOrder', findByKeywords);

router.get('/:id', findSingleItem);

router.get('/:id/shopingCosts', getShippingCost);

export default router;
