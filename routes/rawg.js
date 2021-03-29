require('dotenv').config();
const express = require('express');
const querystring = require('query-string');
const fetch = require('node-fetch');
const router = express.Router();
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_API_URL = process.env.RAWG_API_URL;

router.get('/gameDetails/:slug', getGameDetails, async (req, res) => {
  try {
    res.json(res.gameDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/screenshots/:slug', getGameScreenshots, async (req, res) => {
  try {
    res.json(res.screenshots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/gamesForPlatform?:searchStr', getGamesForPlatforms, async (req, res) => {
  try {
    res.json(res.games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getGameDetails(req, res, next) {
  const { slug } = req.params;

  const url = `${RAWG_API_URL}/${slug}?${RAWG_API_KEY}`;
  const result = await fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        res.status(400).json({ err: `Couldn't fetch data from rawg` });
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => {
      res.status(400).json({ err });
    });

  res.gameDetails = result;
  next();
}

async function getGameScreenshots(req, res, next) {
  const { slug } = req.params;

  const url = `${RAWG_API_URL}/${slug}/screenshots?${RAWG_API_KEY}`;
  const result = await fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        res.status(400).json({ err: `Couldn't fetch data from rawg` });
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => {
      res.status(400).json({ err });
    });

  res.screenshots = result;
  next();
}

async function getGamesForPlatforms(req, res, next) {
  const strQuery = querystring.stringify(req.query);
  console.log(strQuery);

  const url = `${RAWG_API_URL}?${strQuery}&${RAWG_API_KEY}`;
  console.log(url);
  const result = await fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        res.status(400).json({ err: `Couldn't fetch data from rawg` });
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => {
      res.status(400).json({ err });
    });

  res.games = result;
  next();
}

module.exports = router;
