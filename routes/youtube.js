require('dotenv').config();
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const youtube = google.youtube('v3');
const apiKey = process.env.YOUTUBE_API_KEY;

router.get(
  '/soundtrack/:platform/:gameName',
  getSoundtrack,
  async (req, res) => {
    try {
      res.json(res.firstVideoId);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

function getSoundtrack(req, res, next) {
  const { gameName, platform } = req.params;
  const words = `${gameName.split(' ').join('+')}+${platform}+soundtrack`;
  console.log(words);
  youtube.search.list(
    {
      key: apiKey,
      part: 'snippet',
      type: 'video',
      q: words,
      maxResults: 5,
      order: 'relevance',
      videoEmbeddable: true
    },
    (err, response) => {
      if (err) return res.status(500).json({ message: err.errors });
      res.firstVideoId = response.data.items[0].id.videoId;
      next();
    }
  );
}

module.exports = router;
