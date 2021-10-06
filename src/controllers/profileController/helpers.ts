import { AvailablePlatforms, IEbayOffer, IGame, IPlatform } from 'models/types';

export const getPlatform = (
  platformName: AvailablePlatforms,
  platformList: IPlatform[]
): { foundPlatfrom: IPlatform | null; updInd: number } => {
  let foundPlatfrom: IPlatform | null = null;
  let updInd = 1;

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

export const addNewPlatfrom = (platformObj: IPlatform, platformsList: IPlatform[]): IPlatform => {
  platformsList.push(platformObj);
  const lastIdx = platformsList.length - 1;
  return platformsList[lastIdx];
};

export const isGameInList = (gameName: string, gameList: IGame[]): { result: boolean; index: null | number } => {
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

export const getGameForUpd = (gameName: string, gameList: IGame[]): IGame | null => {
  const { index } = isGameInList(gameName, gameList);

  if (index == null) {
    return null;
  }

  return gameList[index];
};

export const findEbayCardById = (ebayItemId: string, ebayItemList: IEbayOffer[]): number | null => {
  for (let i = 0; i < ebayItemList.length; i++) {
    if (ebayItemId === ebayItemList[i].id) {
      return i;
    }
  }
  return null;
};
