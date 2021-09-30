import { NextFunction, Request, Response } from 'express';
import { IAppRes } from './responses';

export type TMiddleWare<
  Req extends Request = Request,
  Res extends Response = Response,
  Next extends NextFunction = NextFunction
> = (req: Req, res: Res, next: Next) => void | Res;

export type TAsyncMiddleWare<
  Req extends Request = Request,
  Res extends Response = Response,
  Next extends NextFunction = NextFunction
> = (req: Req, res: Res, next: Next) => Promise<void | Res>;

export type TErrorHandlingMiddleWare<
  Err extends Error = Error,
  Req extends Request = Request,
  Res extends Response = Response,
  Next extends NextFunction = NextFunction
> = (err: Err, req: Req, res: Res, next: Next) => void | Response;
