require('dotenv').config();

const { google } = require('googleapis');

const youtube = google.youtube('v3');
const apiKey = process.env.YOUTUBE_API_KEY;

const getVideo = async (req, res) => {
  const { videoType, gameName, platform } = req.params;
  const words = `${gameName.split(' ').join('+')}+${platform}+${videoType}`;

  youtube.search
    .list({
      key: apiKey,
      part: 'snippet',
      type: 'video',
      q: words,
      maxResults: 5,
      order: 'relevance',
      videoEmbeddable: true,
    })
    .then((response) => {
      res.firstVideoId = response.data.items[0].id.videoId;
      return res.json(res.firstVideoId);
    })
    .catch((err) => {
      console.log(err.errors);
      return res.status(500).json({ message: err.errors });
    });
};

module.exports = {
  getVideo,
};
