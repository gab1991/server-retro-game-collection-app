import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { TAsyncMiddleWare } from 'typings/middlewares';
import { IAppRes, IAppResBody } from 'typings/responses';

interface IGetVideoParams {
  [key: string]: string;
  videoType: string;
  gameName: string;
  platform: string;
}

export type TGetVideoHandler = TAsyncMiddleWare<
  Request<IGetVideoParams | ParamsDictionary>,
  IAppRes<IAppResBody<string | null>>
>;
