import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { AvailableLists, AvailablePlatforms, IGame, IProfile } from 'models/types';
import { TAsyncMiddleWare, TMiddleWare } from 'typings/middlewares';
import { IAppRes, IAppResBody, ILocalsWithProfile } from 'typings/responses';

// Get profile
type IResGetProfile = IAppRes<IAppResBody<IProfile>, ILocalsWithProfile>;

export type TGetProfileHandler = TMiddleWare<Request, IResGetProfile>;

// Add Game
interface TReqAddProfileBody {
  platform: AvailablePlatforms;
  game: string;
  list: AvailableLists;
  slug: string;
}

type IResAddProfile = IAppRes<IAppResBody<IProfile>, ILocalsWithProfile>;
type TReqAddProfile = Request<ParamsDictionary, IResAddProfile, TReqAddProfileBody>;
export type TAddGameHandler = TAsyncMiddleWare<TReqAddProfile, IResAddProfile>;

// Remove Game
interface TReqDelProfileBody {
  platform: AvailablePlatforms;
  game: string;
  list: AvailableLists;
}

type IResDelProsile = IResAddProfile;
type TReqDelProfile = Request<ParamsDictionary, IResDelProsile, TReqDelProfileBody>;
export type TRemoveGameHandler = TAsyncMiddleWare<TReqDelProfile, IResDelProsile>;

// GetIsWatched
interface IReqGetIsWatchedParams {
  [key: string]: string;
  platform: string;
  gameName: string;
  ebayItemId: string;
}

type IResGetIsWatched = IAppRes<IAppResBody<{ inList: boolean }>, ILocalsWithProfile>;
type TReqGetIsWatched = Request<IReqGetIsWatchedParams | ParamsDictionary, IResGetIsWatched>;
export type TGetIsWatcheEbayCardHanler = TAsyncMiddleWare<TReqGetIsWatched, IResGetIsWatched>;

// ReorderGames
interface TReqReorderGamesBody {
  platform: AvailablePlatforms;
  newSortedGames: IGame[];
  list: AvailableLists;
}

type IResReorderGames = IAppRes<IAppResBody, ILocalsWithProfile>;
type TReqReorderGames = Request<ParamsDictionary, IResReorderGames, TReqReorderGamesBody>;
export type TReorderGamesHandler = TAsyncMiddleWare<TReqReorderGames, IResReorderGames>;

// WatchEbayCard
interface IReqWatchEbayCardBody {
  ebayItemId: number;
  game: string;
  platform: AvailablePlatforms;
}
type IResWatchEbayCard = IAppRes<IAppResBody, ILocalsWithProfile>;
type TReqWatchEbayCard = Request<ParamsDictionary, IResWatchEbayCard, IReqWatchEbayCardBody>;
export type TWatchEbayCardHandler = TAsyncMiddleWare<TReqWatchEbayCard, IResWatchEbayCard>;

// UnWatchEbayCard

type IReqUnWatchEbayCardBody = IReqWatchEbayCardBody;
type IResUnWatchEbayCard = IAppRes<IAppResBody, ILocalsWithProfile>;
type TReqUnWatchEbayCard = Request<ParamsDictionary, IResUnWatchEbayCard, IReqUnWatchEbayCardBody>;
export type TUnWatchEbayCardHandler = TAsyncMiddleWare<TReqUnWatchEbayCard, IResUnWatchEbayCard>;
