const express = require('express');
const { findByKeywords, findSingleItem, getShippingCost } = require('../controllers/ebayController');

const router = express.Router();

router.get('/searchList/:platform/:gameName/:sortOrder', findByKeywords);

router.get('/singleItem/:id', findSingleItem);

router.get('/shopingCosts/:id', getShippingCost);

module.exports = router;
