import jwt from 'jsonwebtoken';
import { TMiddleWare } from 'typings/middlewares';
import { IReqWithVerifiedId } from 'typings/requests';
import { IAppRes } from 'typings/responses';

export const verification: TMiddleWare<IReqWithVerifiedId, IAppRes> = (req, res, next) => {
  const token = req.cookies.authorization;

  if (!token) {
    return res.status(401).json({ err_message: 'token is not provieded', status: 'fail' });
  }

  try {
    const { _id } = jwt.verify(token, process.env.TOKEN_SECRET);

    req.verifiedUserId = _id;
    return next();
  } catch (err) {
    return res.status(400).json({ err_message: 'Access Denied', status: 'fail' });
  }
};
