import { asyncErrorCatcher } from 'utils/asyncErrorCatcher';
import { AppError } from 'utils/AppError';
import { isAvailablePlatform } from 'typings/typeguards/profile';

import { getGameForUpd, isGameInList, addNewPlatfrom, getPlatform, findEbayCardById } from './helpers';
import {
  TAddGameHandler,
  TRemoveGameHandler,
  TGetIsWatcheEbayCardHanler,
  TGetProfileHandler,
  TReorderGamesHandler,
  TWatchEbayCardHandler,
  TUnWatchEbayCardHandler,
  TGetWatchedCardsHanler,
  TToggleEbaySectionHandler,
} from './types';

export const reorderGames = asyncErrorCatcher<TReorderGamesHandler>(async (req, res, next) => {
  const { platform, newSortedGames, list } = req.body;
  const { profile } = res.locals;

  const userPlatforms = profile[list].platforms;
  const { foundPlatfrom } = getPlatform(platform, userPlatforms);

  if (!foundPlatfrom) {
    return next(new AppError("Couldn't find this platfrom in user's platforms", 404));
  }

  if (foundPlatfrom.games.length !== newSortedGames.length) {
    return next(new AppError(`Wrong number of games! In db ${foundPlatfrom.games.length} `, 400));
  }

  foundPlatfrom.games = [...newSortedGames];

  await profile.save();

  return res.json({
    status: 'success',
  });
});

export const getProfile: TGetProfileHandler = (req, res) => {
  const { profile } = res.locals;
  return res.send({ status: 'success', payload: profile });
};

export const addGame = asyncErrorCatcher<TAddGameHandler>(async (req, res, next) => {
  const { platform, game, list, slug } = req.body;
  const { profile } = res.locals;

  const userPlatforms = profile[`${list}`].platforms;

  let { foundPlatfrom } = getPlatform(platform, userPlatforms);

  // if this platform is not in the userlist
  if (!foundPlatfrom) {
    foundPlatfrom = addNewPlatfrom(
      {
        name: platform,
        games: [],
      },
      userPlatforms
    );
  }
  const gamesForPlatform = foundPlatfrom.games;

  // check for existing games
  const isInList = isGameInList(game, gamesForPlatform).result;

  if (isInList) {
    return next(new AppError(`${game} is already in your colletion`, 400));
  }

  gamesForPlatform.push({
    name: game,
    date: new Date(),
    slug,
    isShowEbay: false,
    watchedEbayOffers: [],
  });

  await profile.save();

  return res.send({
    status: 'success',
  });
});

export const removeGame = asyncErrorCatcher<TRemoveGameHandler>(async (req, res, next) => {
  const { platform, game, list } = req.body;
  const { profile } = res.locals;

  const userPlatforms = profile[list].platforms;
  const { foundPlatfrom, updInd } = getPlatform(platform, userPlatforms);

  // if this platform is not in the userlist
  if (!foundPlatfrom) {
    return next(new AppError(`Could'nt find this platfrom in user's platforms`, 400));
  }

  const gamesForPlatform = foundPlatfrom.games;
  // check for existing games
  const gameInd = isGameInList(game, gamesForPlatform).index;

  if (gameInd !== null) {
    gamesForPlatform.splice(gameInd, 1);
  }

  // Check wheter remove directory or not
  if (!gamesForPlatform.length) {
    userPlatforms.splice(updInd, 1);
  }

  await profile.save();

  return res.send({
    status: 'success',
  });
});

export const getIsWatchedEbayCard = asyncErrorCatcher<TGetIsWatcheEbayCardHanler>(async (req, res, next) => {
  const { platform, gameName, ebayItemId } = req.params;
  const { profile } = res.locals;

  if (!platform || !gameName || !ebayItemId || !isAvailablePlatform(platform)) {
    return next(new AppError(`some of the params has not been provided`, 400));
  }

  const userPlatforms = profile.wish_list.platforms;

  const { foundPlatfrom: searchPlatform } = getPlatform(platform, userPlatforms);
  // if this platform is not in the userlist
  if (!searchPlatform) {
    return res.json({
      status: 'success',
      payload: { inList: false },
    });
  }
  const gamesForPlatform = searchPlatform.games;

  // check for existing games
  const gameToSearch = getGameForUpd(gameName, gamesForPlatform);
  if (!gameToSearch) {
    return res.json({
      status: 'success',
      payload: { inList: false },
    });
  }

  // check for existind ebayId
  const ebayOffers = gameToSearch.watchedEbayOffers;
  const isExist = findEbayCardById(ebayItemId, ebayOffers);

  if (isExist !== null) {
    return res.json({
      status: 'success',
      payload: { inList: true },
    });
  }

  return res.json({
    status: 'success',
    payload: { inList: false },
  });
});

export const watchEbayCard = asyncErrorCatcher<TWatchEbayCardHandler>(async (req, res, next) => {
  const { ebayItemId, gameName, platform } = req.params;

  if (!isAvailablePlatform(platform) || !ebayItemId || !gameName) {
    return next(new AppError('some parameters are not correct', 400));
  }

  const { profile } = res.locals;

  const userPlatforms = profile.wish_list.platforms;
  let { foundPlatfrom } = getPlatform(platform, userPlatforms);

  // if this platform is not in the userlist
  if (!foundPlatfrom) {
    foundPlatfrom = addNewPlatfrom(
      {
        name: platform,
        games: [],
      },
      []
    );
  }

  const gamesForPlatform = foundPlatfrom.games;

  // check for existing games
  const gameToChange = getGameForUpd(gameName, gamesForPlatform);

  if (!gameToChange) {
    return next(
      new AppError(`no game with the name ${gameName} has been found in your wishlist`, 400, { showModal: true })
    );
  }

  // check for existind ebayId
  const ebayOffers = gameToChange.watchedEbayOffers;
  const ifExist = findEbayCardById(ebayItemId, ebayOffers);

  if (ifExist !== null) {
    return next(new AppError(`${ebayItemId} is already in your list`, 400));
  }

  gameToChange.watchedEbayOffers.unshift({
    id: ebayItemId.toString(),
    date: new Date(),
  });

  await profile.save();

  return res.json({
    status: `success`,
  });
});

export const unWatchEbayCard = asyncErrorCatcher<TUnWatchEbayCardHandler>(async (req, res, next) => {
  const { ebayItemId, gameName, platform } = req.params;

  if (!isAvailablePlatform(platform) || !ebayItemId || !gameName) {
    return next(new AppError('some parameters are not correct', 400));
  }

  const { profile } = res.locals;

  const userPlatforms = profile.wish_list.platforms;

  const { foundPlatfrom } = getPlatform(platform, userPlatforms);

  // if this platform is not in the userlist
  if (!foundPlatfrom) {
    return next(new AppError(`no platform with the name ${platform} has been found in your wishlist`, 400));
  }

  const gamesForPlatform = foundPlatfrom.games;

  // check for existing games
  const gameToChange = getGameForUpd(gameName, gamesForPlatform);
  if (!gameToChange) {
    return next(new AppError(`no game with the name ${gameName} has been found in your wishlist`, 400));
  }

  // check for existind ebayId
  const ebayOffers = gameToChange.watchedEbayOffers;
  const ebayCardIndex = findEbayCardById(ebayItemId.toString(), ebayOffers);

  if (ebayCardIndex !== null) {
    ebayOffers.splice(ebayCardIndex, 1);
  } else {
    return next(new AppError(`no ebayCard with id ${ebayCardIndex} found`, 400));
  }

  await profile.save();

  return res.json({
    status: 'success',
  });
});

export const getGameWatchedCards = asyncErrorCatcher<TGetWatchedCardsHanler>(async (req, res, next) => {
  const { gameName, platform } = req.params;

  const { profile } = res.locals;
  const userPlatforms = profile.wish_list.platforms;

  if (!isAvailablePlatform(platform)) {
    return next(new AppError(`${platform} platform is not valid`, 400));
  }

  const { foundPlatfrom } = getPlatform(platform, userPlatforms);

  // if this platform is not in the userlist
  if (!foundPlatfrom) {
    return next(new AppError(`no platform with the name ${platform} has been found in your wishlist`, 400));
  }

  const gamesForPlatform = foundPlatfrom.games;

  const gameToChange = getGameForUpd(gameName, gamesForPlatform);
  if (!gameToChange) {
    return next(new AppError(`no game with the name ${gameName} has been found in your wishlist`, 400));
  }

  // check for existind ebayId
  const ebayOffers = gameToChange.watchedEbayOffers;

  return res.json({
    status: 'success',
    payload: ebayOffers,
  });
});

export const toggleEbaySection = asyncErrorCatcher<TToggleEbaySectionHandler>(async (req, res, next) => {
  const { game, platform, isShowed } = req.body;
  const { profile } = res.locals;

  const userPlatforms = profile.wish_list.platforms;

  const { foundPlatfrom } = getPlatform(platform, userPlatforms);

  // if this platform is not in the userlist
  if (!foundPlatfrom) {
    return next(new AppError(`no platform with the name ${platform} has been found in your wishlist`, 400));
  }
  const gamesForPlatform = foundPlatfrom.games;

  const gameToSearch = getGameForUpd(game, gamesForPlatform);
  // check for existing games
  if (!gameToSearch) {
    return next(new AppError(`no game with the name ${game} has been found in your wishlist`, 400));
  }
  // changing the rule
  gameToSearch.isShowEbay = isShowed;

  await profile.save();

  return res.json({
    status: 'success',
  });
});
