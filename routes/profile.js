const express = require('express');
const router = express.Router();
const verify = require('../tokenVerification/verifyToken.js');
const Profile = require('../models/Profile.js');

router.get('/', verify.verifyToken, async (req, res) => {
  const verifiedId = req.verifiedUserData._id;
  try {
    const profile = await Profile.findOne({ _id: verifiedId });
    if (profile.length === 0) {
      return res.status(400).send({ err_message: 'no such user' });
    }
    return res.send(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/update', verify.verifyToken, async (req, res) => {
  const verifiedId = req.verifiedUserData._id;
  const { action } = req.body;
  try {
    const profile = await Profile.findOne({ _id: verifiedId });
    if (profile.length === 0) {
      return res.status(400).send({ err_message: 'no such user' });
    }

    switch (action) {
      case 'addGame':
        addGame(profile, req, res);
        break;
      case 'removeGame':
        removeGame(profile, req, res);
        break;
      case 'reorder':
        reorderGames(profile, req, res);
        break;
      default:
        break;
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/isWatchedEbayCard', verify.verifyToken, isWatchedEbayCard);

router.post('/addEbayCard', verify.verifyToken, addEbayCard, async (req, res) => {
  try {
    res.json({ success: res.success });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/removeEbayCard', verify.verifyToken, removeEbayCard, async (req, res) => {
  try {
    res.json({ success: res.success });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getGameWatchedCards/:platform/:gameName', verify.verifyToken, getGameWatchedCards, async (req, res) => {
  try {
    res.json(res.success);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/toggleEbaySection', verify.verifyToken, toggleEbaySection, async (req, res) => {
  try {
    res.json({ success: res.success });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

  return { foundPlatfrom, updInd };
}

function addNewPlatfrom(platformObj, platformsList) {
  platformsList.push(platformObj);
  const lastIdx = platformsList.length - 1;
  return platformsList[lastIdx];
}

function isGameInList(gameName, gameList) {
  for (let i = 0; i < gameList.length; i++) {
    if (gameName === gameList[i].name) {
      return { result: true, index: i };
    }
  }
  return { result: false, index: null };
}

function getGameForUpd(gameName, gameList) {
  const { index } = isGameInList(gameName, gameList);
  if (index == null) return null;
  return gameList[index];
}

async function addGame(profile, req, res) {
  try {
    const { platform, game, list } = req.body;

    //check wich list to update
    const userList = list === 'owned_list' ? 'owned_list' : 'wish_list';
    const userPlatforms = profile[userList].platforms;
    let { foundPlatfrom } = getPlatform(platform, userPlatforms);
    // if this platform is not in the userlist
    if (!foundPlatfrom) {
      foundPlatfrom = addNewPlatfrom({ name: platform, games: [] }, userPlatforms);
    }

    // {
    //   userPlatforms.push({ name: platform, games: [] });
    //   const lastIdx = userPlatforms.length - 1;
    //   foundPlatfrom = userPlatforms[lastIdx];
    // }

    const gamesForPlatform = foundPlatfrom.games;
    // check for existing games
    let isInList = isGameInList(game.name, gamesForPlatform).result;
    if (isInList)
      return res.status(400).send({
        err_message: `${game.name} is already in your colletion`,
      });
    gamesForPlatform.push({
      slug: game.slug,
      name: game.name,
      date: Date.now(),
    });
    await profile.save();
    res.send({ success: `${game.name} has been added successfully` });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
}

async function removeGame(profile, req, res) {
  try {
    const { platform, game, list } = req.body;
    const userList = list === 'owned_list' ? 'owned_list' : 'wish_list';
    const userPlatforms = profile[userList].platforms;
    const { foundPlatfrom, updInd } = getPlatform(platform, userPlatforms);

    // if this platform is not in the userlist
    if (!foundPlatfrom) {
      return res.status(400).send({
        err_message: `Could'nt find this platfrom in user's platforms`,
      });
    }

    let gamesForPlatform = foundPlatfrom.games;
    // check for existing games
    const gameInd = isGameInList(game, gamesForPlatform).index;

    if (gameInd !== null) gamesForPlatform.splice(gameInd, 1);

    // Check wheter remove directory or not
    if (gamesForPlatform.length === 0) userPlatforms.splice(updInd, 1);

    await profile.save();
    res.send({ success: `${game} has been removed successfully` });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
}

async function reorderGames(profile, req, res) {
  try {
    const { platform, newSortedGames, list } = req.body;
    const userPlatforms = profile[list].platforms;
    const { foundPlatfrom } = getPlatform(platform, userPlatforms);

    // if this platform is not in the userlist
    if (!foundPlatfrom) {
      return res.status(400).send({
        err_message: `Couldn't find this platfrom in user's platforms`,
      });
    }

    // check for equal counts
    if (foundPlatfrom.games.length !== newSortedGames.length) {
      return res.status(400).send({
        err_message: `Wrong number of games! In db ${foundPlatfrom.games.length} in request ${sortedGames.length}`,
      });
    }

    foundPlatfrom.games = [...newSortedGames];
    await profile.save();
    res.send({ success: `reordering done` });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
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

async function addEbayCard(req, res, next) {
  const { ebayItemId, game, platform } = req.body;
  const verifiedId = req.verifiedUserData._id;
  try {
    const profile = await Profile.findOne({ _id: verifiedId });

    if (profile.length === 0) {
      return res.status(400).send({ err_message: 'no such user' });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;
    let { foundPlatfrom } = getPlatform(platform, userPlatforms);

    // if this platform is not in the userlist
    if (!foundPlatfrom) {
      foundPlatfrom = addNewPlatfrom({ name: platform, games: [] });
    }

    const gamesForPlatform = foundPlatfrom.games;

    const gameToChange = getGameForUpd(game, gamesForPlatform);
    // check for existing games

    if (!gameToChange)
      return res.status(400).send({
        err_message: `no game with the name ${game} has been found in your wishlist`,
        show_modal: true,
      });

    // check for existind ebayId
    const ebayOffers = gameToChange.watchedEbayOffers;
    const ifExist = findEbayCardById(ebayItemId, ebayOffers);
    if (ifExist !== null)
      return res.status(400).send({
        err_message: `${ebayItemId} is already in your list`,
      });

    gameToChange.watchedEbayOffers.unshift({
      id: ebayItemId,
      date: Date.now(),
    });
    await profile.save();
    res.success = `${ebayItemId} has been added successfully to your EbayWatch`;
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

async function isWatchedEbayCard(req, res, next) {
  const verifiedId = req.verifiedUserData._id;
  const { ebayItemId, game, platform } = req.body;
  try {
    const profile = await Profile.findOne({ _id: verifiedId });

    if (profile.length === 0) {
      return res.status(400).send({ err_message: 'no such user' });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;

    let { foundPlatfrom: searchPlatform } = getPlatform(platform, userPlatforms);
    // if this platform is not in the userlist
    if (!searchPlatform) {
      return res.status(200).json({ missed: 'not in the list' });
    }
    const gamesForPlatform = searchPlatform.games;

    // check for existing games
    const gameToSearch = getGameForUpd(game, gamesForPlatform);
    if (!gameToSearch) {
      return res.status(200).json({ missed: 'not in the list' });
    }

    // check for existind ebayId
    const ebayOffers = gameToSearch.watchedEbayOffers;
    const isExist = findEbayCardById(ebayItemId, ebayOffers);
    if (isExist !== null) return res.status(200).json({ success: 'in the list' });
    else return res.status(200).json({ missed: 'not in the list' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function removeEbayCard(req, res, next) {
  const { ebayItemId, game, platform } = req.body;
  const verifiedId = req.verifiedUserData._id;

  try {
    const profile = await Profile.findOne({ _id: verifiedId });
    if (profile.length === 0) {
      return res.status(400).send({ err_message: 'no such user' });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;

    const { foundPlatfrom } = getPlatform(platform, userPlatforms);
    // if this platform is not in the userlist
    if (!foundPlatfrom)
      return res.status(400).send({
        err_message: `no game with the name ${game} has been found in your wishlist`,
      });

    const gamesForPlatform = foundPlatfrom.games;

    // check for existing games
    const gameToChange = getGameForUpd(game, gamesForPlatform);
    if (!gameToChange)
      return res.status(400).send({
        err_message: `no game with the name ${game} has been found in your wishlist`,
      });

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
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

async function getGameWatchedCards(req, res, next) {
  const { gameName, platform } = req.params;
  const verifiedId = req.verifiedUserData._id;

  try {
    const profile = await Profile.findOne({ _id: verifiedId });

    if (profile.length === 0) {
      return res.status(400).send({ err_message: 'no such user' });
    }
    // check which list to update
    const userList = 'wish_list';
    const userPlatforms = profile[userList].platforms;

    const { foundPlatfrom } = getPlatform(platform, userPlatforms);
    // if this platform is not in the userlist
    if (!foundPlatfrom)
      return res.status(400).send({
        err_message: `no game with the name ${gameName} has been found in your wishlist`,
      });

    const gamesForPlatform = foundPlatfrom.games;

    const gameToChange = getGameForUpd(gameName, gamesForPlatform);
    if (!gameToChange)
      return res.status(400).send({
        err_message: `no game with the name ${gameName} has been found in your wishlist`,
      });

    // check for existind ebayId
    const ebayOffers = gameToChange.watchedEbayOffers;
    res.success = ebayOffers;
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

async function toggleEbaySection(req, res, next) {
  const verifiedId = req.verifiedUserData._id;
  const { game, platform, isShowed } = req.body;
  try {
    const profile = await Profile.findOne({ _id: verifiedId });

    if (profile.length === 0) {
      return res.status(400).send({ err_message: 'no such user' });
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
      return res.status(200).json({ missed: 'not in the list' });
    }
    const gamesForPlatform = searchPlatform.games;

    const gameToSearch = getGameForUpd(game, gamesForPlatform);
    // check for existing games
    if (!gameToSearch) {
      return res.status(200).json({ missed: 'not in the list' });
    }
    // changing the rule
    gameToSearch.isShowEbay = isShowed;
    await profile.save();
    res.success = `Ebay section has been ${isShowed === true ? 'showed' : 'hidden'}`;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
