import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { AvailablePlatforms, IProfile } from 'models/types';
import { TAsyncMiddleWare, TMiddleWare } from 'typings/middlewares';
import { IAppRes, IAppResBody, ILocalsWithProfile } from 'typings/responses';

// Get profile
type IResGetProfile = IAppRes<IAppResBody<IProfile>, ILocalsWithProfile>;

export type TGetProfileHandler = TMiddleWare<Request, IResGetProfile>;

// Add Profile
interface TReqAddProfileBody {
  platform: AvailablePlatforms;
  game: string;
  list: string;
  slug: string;
}

type IResAddProfile = IAppRes<IAppResBody<IProfile>, ILocalsWithProfile>;
type TReqAddProfile = Request<ParamsDictionary, IResAddProfile, TReqAddProfileBody>;
export type TAddProfileHandler = TAsyncMiddleWare<TReqAddProfile, IResAddProfile>;
