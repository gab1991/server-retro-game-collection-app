import { NextFunction, Request, Response } from 'express';

export type TAsyncMiddleWare<
  Req extends Request = Request,
  Res extends Response = Response,
  Next extends NextFunction = NextFunction
> = (req: Req, res: Res, next: Next) => Promise<void>;
