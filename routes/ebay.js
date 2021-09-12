const express = require('express');
const { findByKeywords, findSingleItem, getShippingCost } = require('../controllers/ebayController');

const router = express.Router();

// Endpoints
router.get('/searchList/:platform/:gameName/:sortOrder', findByKeywords);

router.get('/:id', findSingleItem);

router.get('/:id/shopingCosts', getShippingCost);

module.exports = router;
