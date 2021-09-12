const express = require('express');
const { getBoxArt } = require('../controllers/boxArtController');

const router = express.Router();

// Endpoints
router.get('/:platform/:gameName', getBoxArt);

module.exports = router;
