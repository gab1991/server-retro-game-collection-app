export interface IEbayOffer {
  id: string;
  date: Date;
}

export interface IGame {
  slug: string;
  name: string;
  date: Date;
  isShowEbay: boolean;
  watchedEbayOffers: IEbayOffer[];
}

export enum AvailablePlatforms {
  'Genesis' = 'Genesis',
  'PlayStation' = 'PlayStation',
  'NES' = 'NES',
}

export enum AvailableLists {
  WishList = 'wish_list',
  OwnedList = 'owned_list',
}

export interface IPlatform {
  name: AvailablePlatforms;
  games: IGame[];
}

export interface IProfile {
  username: string;
  password: string;
  email: string;
  createdDate: Date;
  [AvailableLists.OwnedList]: { platforms: IPlatform[] };
  [AvailableLists.WishList]: { platforms: IPlatform[] };
}
