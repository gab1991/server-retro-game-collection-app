const { RAWG_API_KEY } = process.env;
const { RAWG_API_URL } = process.env;

const superagent = require('superagent');

const getGameDetails = async (req, res) => {
  const { slug } = req.params;

  const url = `${RAWG_API_URL}/${slug}?key=${RAWG_API_KEY}`;

  try {
    const { status, body } = await superagent.get(url);

    if (status !== 200) {
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.gameDetails = body;
    return res.json(res.gameDetails);
  } catch (err) {
    return res.status(400).json({ err });
  }
};

const getGameScreenshots = async (req, res) => {
  const { slug } = req.params;

  const url = `${RAWG_API_URL}/${slug}/screenshots?key=${RAWG_API_KEY}`;

  try {
    const { status, body } = await superagent.get(url);

    if (status !== 200) {
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.screenshots = body;
    return res.json(res.screenshots);
  } catch (err) {
    return res.status(400).json({ err });
  }
};

const getGamesForPlatforms = async (req, res) => {
  const strQuery = new URLSearchParams(req.query).toString();

  const url = `${RAWG_API_URL}?${strQuery}&key=${RAWG_API_KEY}`;

  try {
    const { status, body } = await superagent.get(url);

    if (status !== 200) {
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.games = body;
    return res.json(res.games);
  } catch (err) {
    return res.status(400).json({ err });
  }
};

module.exports = {
  getGameDetails,
  getGameScreenshots,
  getGamesForPlatforms,
};
