const Profile = require('../models/Profile.js');

// HELPERS

function getPlatform(platformName, platformList) {
  let foundPlatfrom;
  let updInd;
  for (let i = 0; i < platformList.length; i++) {
    if (platformName === platformList[i].name) {
      foundPlatfrom = platformList[i];
      updInd = i;
      break;
    }
  }

  return {
    foundPlatfrom,
    updInd,
  };
}

function addNewPlatfrom(platformObj, platformsList) {
  platformsList.push(platformObj);
  const lastIdx = platformsList.length - 1;
  return platformsList[lastIdx];
}

function isGameInList(gameName, gameList) {
  for (let i = 0; i < gameList.length; i++) {
    if (gameName === gameList[i].name) {
      return {
        result: true,
        index: i,
      };
    }
  }
  return {
    result: false,
    index: null,
  };
}

function getGameForUpd(gameName, gameList) {
  const { index } = isGameInList(gameName, gameList);
  if (index == null) return null;
  return gameList[index];
}

async function reorderGames(profile, req, res) {
  try {
    const { platform, newSortedGames, list } = req.body;
    const userPlatforms = profile[list].platforms;
    const { foundPlatfrom } = getPlatform(platform, userPlatforms);

    // if this platform is not in the userlist
    if (!foundPlatfrom) {
      return res.status(400).send({
        err_message: "Couldn't find this platfrom in user's platforms",
      });
    }

    // check for equal counts
    if (foundPlatfrom.games.length !== newSortedGames.length) {
      return res.status(400).send({
        err_message: `Wrong number of games! In db ${foundPlatfrom.games.length} `,
      });
    }

    foundPlatfrom.games = [...newSortedGames];
    await profile.save();
    return res.send({
      success: 'reordering done',
    });
  } catch (err) {
    return res.status(500).send({
      message: err,
    });
  }
}

function findEbayCardById(ebayItemId, ebayItemList) {
  for (let i = 0; i < ebayItemList.length; i++) {
    if (ebayItemId === ebayItemList[i].id) {
      return i;
    }
  }
  return null;
}

const getProfile = async (req, res, next) => {
  const verifiedId = req.verifiedUserId;

  try {
    const profile = await Profile.findOne({
      _id: verifiedId,
    });

    if (profile.length === 0) {
      return res.status(400).send({
        err_message: 'no such user',
      });
    }

    return res.send(profile);
  } catch (err) {
    return next(err);
  }
};

const addGame = async (req, res) => {
  const { platform, game, list } = req.body;
  const { profile } = req;

  try {
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
      });
    }

    gamesForPlatform.push({
      name: game,
      date: Date.now(),
    });

    await profile.save();

    return res.send({
      success: `${game} has been added successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const removeGame = async (req, res) => {
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

const updateProfile = async (req, res) => {
  const verifiedId = req.verifiedUserId;
  const { action } = req.body;

  try {
    const profile = await Profile.findOne({
      _id: verifiedId,
    });

    if (!profile.length) {
      return res.status(400).send({
        err_message: 'No such user',
      });
    }

    switch (action) {
      case 'reorder':
        return reorderGames(profile, req, res);
      default:
        return null;
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getIsWatchedEbayCard = async (req, res) => {
  const verifiedId = req.verifiedUserId;
  const { ebayItemId, game, platform } = req.body;

  try {
    const profile = await Profile.findOne({
      _id: verifiedId,
    });

    if (profile.length === 0) {
      return res.status(400).send({
        err_message: 'no such user',
      });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;

    const { foundPlatfrom: searchPlatform } = getPlatform(platform, userPlatforms);
    // if this platform is not in the userlist
    if (!searchPlatform) {
      return res.status(200).json({
        missed: 'not in the list',
      });
    }
    const gamesForPlatform = searchPlatform.games;

    // check for existing games
    const gameToSearch = getGameForUpd(game, gamesForPlatform);
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
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const addEbayCard = async (req, res) => {
  const { ebayItemId, game, platform } = req.body.ebayCard;

  const verifiedId = req.verifiedUserId;

  try {
    const profile = await Profile.findOne({
      _id: verifiedId,
    });

    if (profile.length === 0) {
      return res.status(400).send({
        err_message: 'no such user',
      });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;
    let { foundPlatfrom } = getPlatform(platform, userPlatforms);

    // if this platform is not in the userlist
    if (!foundPlatfrom) {
      foundPlatfrom = addNewPlatfrom({
        name: platform,
        games: [],
      });
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
      date: Date.now(),
    });
    await profile.save();
    res.success = `${ebayItemId} has been added successfully to your EbayWatch`;

    return res.json({
      success: res.success,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const removeEbayCard = async (req, res) => {
  const { ebayItemId, game, platform } = req.body;
  const verifiedId = req.verifiedUserId;

  try {
    const profile = await Profile.findOne({
      _id: verifiedId,
    });
    if (profile.length === 0) {
      return res.status(400).send({
        err_message: 'no such user',
      });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;

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

    res.success = `${ebayItemId} has been removed `;
    return res.json({
      success: res.success,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getGameWatchedCards = async (req, res) => {
  const { gameName, platform } = req.params;
  const verifiedId = req.verifiedUserId;

  try {
    const profile = await Profile.findOne({
      _id: verifiedId,
    });

    if (profile.length === 0) {
      return res.status(400).send({
        err_message: 'no such user',
      });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;

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
    res.success = ebayOffers;
    return res.json(res.success);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const toggleEbaySection = async (req, res) => {
  const verifiedId = req.verifiedUserId;
  const { game, platform, isShowed } = req.body;
  try {
    const profile = await Profile.findOne({
      _id: verifiedId,
    });

    if (profile.length === 0) {
      return res.status(400).send({
        err_message: 'no such user',
      });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;

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
    res.success = `Ebay section has been ${isShowed === true ? 'showed' : 'hidden'}`;
    return res.json({
      success: res.success,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getIsWatchedEbayCard,
  addEbayCard,
  removeEbayCard,
  getGameWatchedCards,
  toggleEbaySection,
  addGame,
  removeGame,
};
