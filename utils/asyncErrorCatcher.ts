import { Request, Response, NextFunction } from 'express';

type TProtectedFunction = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncErrorCatcher =
  (fn: TProtectedFunction) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
