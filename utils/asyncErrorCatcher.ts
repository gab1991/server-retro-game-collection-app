import { Request, Response, NextFunction } from 'express';

type TAsyncMiddleWare = <Req extends Request, Res extends Response, Next extends NextFunction>(
  req: Req,
  res: Res,
  next: Next
) => Promise<void>;

export const asyncErrorCatcher =
  (fn: TAsyncMiddleWare) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
