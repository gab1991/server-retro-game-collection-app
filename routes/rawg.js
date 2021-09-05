require('dotenv').config();
const express = require('express');
const querystring = require('query-string');
const superagent = require('superagent');

const router = express.Router();
const { RAWG_API_KEY } = process.env;
const { RAWG_API_URL } = process.env;

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

  const url = `${RAWG_API_URL}/${slug}?key=${RAWG_API_KEY}`;

  try {
    const { status, body } = await superagent.get(url);

    if (status !== 200) {
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.gameDetails = body;
    next();
  } catch (err) {
    res.status(400).json({ err });
  }
}

async function getGameScreenshots(req, res, next) {
  const { slug } = req.params;

  const url = `${RAWG_API_URL}/${slug}/screenshots?key=${RAWG_API_KEY}`;

  try {
    const { status, body } = await superagent.get(url);

    if (status !== 200) {
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.screenshots = body;
    next();
  } catch (err) {
    res.status(400).json({ err });
  }
}

async function getGamesForPlatforms(req, res, next) {
  const strQuery = querystring.stringify(req.query);

  const url = `${RAWG_API_URL}?${strQuery}&key=${RAWG_API_KEY}`;

  try {
    const { status, body } = await superagent.get(url);

    if (status !== 200) {
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.games = body;
    next();
  } catch (err) {
    res.status(400).json({ err });
  }
}

module.exports = router;
