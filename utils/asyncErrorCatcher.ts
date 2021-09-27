import { Request, Response, NextFunction } from 'express';
import { TAsyncMiddleWare } from 'typings/middlewares';

export const asyncErrorCatcher =
  (fn: TAsyncMiddleWare) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

export type TAsyncCaughtMiddleware<T extends TAsyncMiddleWare> = (fn: T) => void;
