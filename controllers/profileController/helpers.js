const getPlatform = (platformName, platformList) => {
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
};

const addNewPlatfrom = (platformObj, platformsList) => {
  platformsList.push(platformObj);
  const lastIdx = platformsList.length - 1;
  return platformsList[lastIdx];
};

const isGameInList = (gameName, gameList) => {
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
};

const getGameForUpd = (gameName, gameList) => {
  const { index } = isGameInList(gameName, gameList);
  if (index == null) return null;
  return gameList[index];
};

const findEbayCardById = (ebayItemId, ebayItemList) => {
  for (let i = 0; i < ebayItemList.length; i++) {
    if (ebayItemId === ebayItemList[i].id) {
      return i;
    }
  }
  return null;
};

module.exports = { getGameForUpd, isGameInList, addNewPlatfrom, getPlatform, findEbayCardById };
