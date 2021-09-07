const express = require('express');
const { getVideo } = require('../controllers/youtubeController');

const router = express.Router();

router.get('/:videoType/:platform/:gameName', getVideo);

module.exports = router;
