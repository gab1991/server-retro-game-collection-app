import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { TAsyncMiddleWare } from 'typings/middlewares';
import { IAppRes, IAppResBody } from 'typings/responses';

// GetBoxArt
interface IReqGetBoxArtParams {
  [key: string]: string;
  platform: string;
  gameName: string;
}

type IResGetBoxArt = IAppRes<IAppResBody<string>>;
type TReqGetBoxArt = Request<IReqGetBoxArtParams | ParamsDictionary, IResGetBoxArt>;
export type TGetBoxArtHanler = TAsyncMiddleWare<TReqGetBoxArt, IResGetBoxArt>;
