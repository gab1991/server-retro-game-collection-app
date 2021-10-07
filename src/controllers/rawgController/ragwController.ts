import superagent from 'superagent';

import { AppError } from 'utils/AppError';
import { asyncErrorCatcher } from 'utils/asyncErrorCatcher';
import { TGetGameDetailsHandler, TGetGameScreenshotsHandler, TGetGamesForPlatformsHandler } from './types';

const { RAWG_API_KEY } = process.env;
const { RAWG_API_URL } = process.env;

export const getGameDetails = asyncErrorCatcher<TGetGameDetailsHandler>(async (req, res, next) => {
  const { slug } = req.params;

  const url = `${RAWG_API_URL}/${slug}?key=${RAWG_API_KEY}`;

  const { status, body } = await superagent.get(url);

  if (status !== 200) {
    return next(new AppError("Couldn't fetch data from rawg", status));
  }

  res.set({
    'Cache-Control': 'public, max-age=2592000', // one month cache
  });

  return res.json(body);
});

export const getGameScreenshots = asyncErrorCatcher<TGetGameScreenshotsHandler>(async (req, res, next) => {
  const { slug } = req.params;

  const url = `${RAWG_API_URL}/${slug}/screenshots?key=${RAWG_API_KEY}`;
  const { status, body } = await superagent.get(url);

  if (status !== 200) {
    return next(new AppError("Couldn't fetch data from rawg", status));
  }

  res.set({
    'Cache-Control': 'public, max-age=2592000', // one month cache
  });

  return res.json(body);
});

export const getGamesForPlatforms = asyncErrorCatcher<TGetGamesForPlatformsHandler>(async (req, res, next) => {
  const strQuery = new URLSearchParams(req.query as Record<string, string>).toString();

  const url = `${RAWG_API_URL}?${strQuery}&key=${RAWG_API_KEY}`;

  const { status, body } = await superagent.get(url);

  if (status !== 200) {
    return next(new AppError("Couldn't fetch data from rawg", status));
  }

  return res.json(body);
});
