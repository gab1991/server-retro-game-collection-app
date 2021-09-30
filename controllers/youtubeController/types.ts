import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { TAsyncMiddleWare } from 'typings/middlewares';

interface IGetVideoParams {
  [key: string]: string;
  videoType: string;
  gameName: string;
  platform: string;
}

export type TGetVideoHandler = TAsyncMiddleWare<Request<IGetVideoParams | ParamsDictionary>, Response<string | null>>;
