import { asyncErrorCatcher } from 'utils/asyncErrorCatcher';
import { AppError } from 'utils/AppError';
import { getGameForUpd, isGameInList, addNewPlatfrom, getPlatform, findEbayCardById } from './helpers';
import { TAddProfileHandler, TGetProfileHandler } from './types';

export const reorderGames = asyncErrorCatcher(async (req, res, next) => {
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

  return res.send({
    success: 'reordering done',
  });
});

export const getProfile: TGetProfileHandler = (req, res) => {
  const { profile } = res.locals;
  return res.send({ status: 'success', data: profile });
};

export const addGame = asyncErrorCatcher<TAddProfileHandler>(async (req, res) => {
  const { platform, game, list, slug } = req.body;
  const { profile } = res.locals;

  const userPlatforms = profile[list].platforms;
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
    return res.status(400).send({
      err_message: `${game} is already in your colletion`,
      status: 'fail',
    });
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

export const removeGame = async (req, res) => {
  const { platform, game, list } = req.body;
  const { profile } = req;

  try {
    const userPlatforms = profile[list].platforms;
    const { foundPlatfrom, updInd } = getPlatform(platform, userPlatforms);

    // if this platform is not in the userlist
    if (!foundPlatfrom) {
      return res.status(400).send({
        err_message: "Could'nt find this platfrom in user's platforms",
      });
    }

    const gamesForPlatform = foundPlatfrom.games;
    // check for existing games
    const gameInd = isGameInList(game, gamesForPlatform).index;

    if (gameInd !== null) {
      gamesForPlatform.splice(gameInd, 1);
    }

    // Check wheter remove directory or not
    if (gamesForPlatform.length === 0) {
      userPlatforms.splice(updInd, 1);
    }

    await profile.save();
    return res.send({
      success: `${game} has been removed successfully`,
    });
  } catch (err) {
    return res.status(500).send({
      message: err,
    });
  }
};

export const getIsWatchedEbayCard = asyncErrorCatcher(async (req, res) => {
  const { profile } = res.locals;
  const { platform, gameName, ebayItemId } = req.params;

  const userPlatforms = profile.wish_list.platforms;

  const { foundPlatfrom: searchPlatform } = getPlatform(platform, userPlatforms);
  // if this platform is not in the userlist
  if (!searchPlatform) {
    return res.status(200).json({
      missed: 'not in the list',
    });
  }
  const gamesForPlatform = searchPlatform.games;

  // check for existing games
  const gameToSearch = getGameForUpd(gameName, gamesForPlatform);
  if (!gameToSearch) {
    return res.status(200).json({
      missed: 'not in the list',
    });
  }

  // check for existind ebayId
  const ebayOffers = gameToSearch.watchedEbayOffers;
  const isExist = findEbayCardById(ebayItemId, ebayOffers);
  if (isExist !== null) {
    return res.status(200).json({
      success: 'in the list',
    });
  }
  return res.status(200).json({
    missed: 'not in the list',
  });
});

export const addEbayCard = asyncErrorCatcher(async (req, res) => {
  const { ebayItemId, game, platform } = req.body.ebayCard;
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

  const gameToChange = getGameForUpd(game, gamesForPlatform);
  // check for existing games

  if (!gameToChange) {
    return res.status(400).send({
      err_message: `no game with the name ${game} has been found in your wishlist`,
      show_modal: true,
    });
  }

  // check for existind ebayId
  const ebayOffers = gameToChange.watchedEbayOffers;
  const ifExist = findEbayCardById(ebayItemId, ebayOffers);
  if (ifExist !== null) {
    return res.status(400).send({
      err_message: `${ebayItemId} is already in your list`,
    });
  }

  gameToChange.watchedEbayOffers.unshift({
    id: ebayItemId,
    date: new Date(),
  });
  await profile.save();
  // @ts-ignore
  res.success = `${ebayItemId} has been added successfully to your EbayWatch`;

  return res.json({
    // @ts-ignore
    success: res.success,
  });
});

export const removeEbayCard = asyncErrorCatcher(async (req, res) => {
  const { ebayItemId, game, platform } = req.body;
  const { profile } = res.locals;

  const userPlatforms = profile.wish_list.platforms;

  const { foundPlatfrom } = getPlatform(platform, userPlatforms);
  // if this platform is not in the userlist
  if (!foundPlatfrom) {
    return res.status(400).send({
      err_message: `no game with the name ${game} has been found in your wishlist`,
    });
  }

  const gamesForPlatform = foundPlatfrom.games;

  // check for existing games
  const gameToChange = getGameForUpd(game, gamesForPlatform);
  if (!gameToChange) {
    return res.status(400).send({
      err_message: `no game with the name ${game} has been found in your wishlist`,
    });
  }

  // check for existind ebayId
  const ebayOffers = gameToChange.watchedEbayOffers;
  const ebayCardIndex = findEbayCardById(ebayItemId, ebayOffers);

  if (ebayCardIndex !== null) {
    ebayOffers.splice(ebayCardIndex, 1);
  } else {
    return res.status(400).send({
      err_message: `no ebayCard with id ${ebayCardIndex} found`,
    });
  }

  await profile.save();

  // @ts-ignore
  res.success = `${ebayItemId} has been removed `;
  return res.json({
    // @ts-ignore
    success: res.success,
  });
});

export const getGameWatchedCards = asyncErrorCatcher(async (req, res) => {
  const { gameName, platform } = req.params;

  const { profile } = res.locals;
  const userPlatforms = profile.wish_list.platforms;

  const { foundPlatfrom } = getPlatform(platform, userPlatforms);
  // if this platform is not in the userlist
  if (!foundPlatfrom) {
    return res.status(400).send({
      err_message: `no game with the name ${gameName} has been found in your wishlist`,
    });
  }

  const gamesForPlatform = foundPlatfrom.games;

  const gameToChange = getGameForUpd(gameName, gamesForPlatform);
  if (!gameToChange) {
    return res.status(400).send({
      err_message: `no game with the name ${gameName} has been found in your wishlist`,
    });
  }

  // check for existind ebayId
  const ebayOffers = gameToChange.watchedEbayOffers;

  // @ts-ignore
  res.success = ebayOffers;

  // @ts-ignore
  return res.json(res.success);
});

export const toggleEbaySection = asyncErrorCatcher(async (req, res) => {
  const { game, platform, isShowed } = req.body;
  const { profile } = res.locals;

  const userPlatforms = profile.wish_list.platforms;

  let searchPlatform;
  for (let i = 0; i < userPlatforms.length; i++) {
    if (platform === userPlatforms[i].name) {
      searchPlatform = userPlatforms[i];
      break;
    }
  }
  // if this platform is not in the userlist
  if (!searchPlatform) {
    return res.status(200).json({
      missed: 'not in the list',
    });
  }
  const gamesForPlatform = searchPlatform.games;

  const gameToSearch = getGameForUpd(game, gamesForPlatform);
  // check for existing games
  if (!gameToSearch) {
    return res.status(200).json({
      missed: 'not in the list',
    });
  }
  // changing the rule
  gameToSearch.isShowEbay = isShowed;

  await profile.save();

  // @ts-ignore
  res.success = `Ebay section has been ${isShowed === true ? 'showed' : 'hidden'}`;
  return res.json({
    // @ts-ignore
    success: res.success,
  });
});
