import { Request } from 'express';
import { IAppRes, IAppResBody } from 'typings/responses';
import { ParamsDictionary } from 'express-serve-static-core';
import { TAsyncMiddleWare } from 'typings/middlewares';

// GetGameDetails
interface IReqGetGameDetailsParams {
  [key: string]: string;
  slug: string;
}
type IResGetGameDetails = IAppRes<IAppResBody>;
type TReqGetGameDetails = Request<ParamsDictionary | IReqGetGameDetailsParams, IResGetGameDetails>;
export type TGetGameDetailsHandler = TAsyncMiddleWare<TReqGetGameDetails, IResGetGameDetails>;

// GetGameScreenshots
type IReqGetGameScreenshotsParams = IReqGetGameDetailsParams;
type IResGetGameScreenshots = IAppRes<IAppResBody>;
type TReqGetGameScreenshots = Request<ParamsDictionary | IReqGetGameScreenshotsParams, IResGetGameScreenshots>;
export type TGetGameScreenshotsHandler = TAsyncMiddleWare<TReqGetGameScreenshots, IResGetGameScreenshots>;

// GetGamesForPlatforms

type IResGetGamesForPlatforms = IAppRes<IAppResBody>;
type TReqGetGamesForPlatforms = Request<ParamsDictionary, IResGetGamesForPlatforms>;
export type TGetGamesForPlatformsHandler = TAsyncMiddleWare<TReqGetGamesForPlatforms, IResGetGamesForPlatforms>;
