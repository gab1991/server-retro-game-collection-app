import jwt from 'jsonwebtoken';
import { TMiddleWare } from 'typings/middlewares';
import { IReqWithCookies } from 'typings/requests';
import { IResWithVerifiedId } from 'typings/responses';
import { isString } from 'typings/typeguards';

const { TOKEN_SECRET } = process.env;

interface IJWTpayload {
  [key: string]: string;
  _id: string;
}

const isJWTpayload = (payload: any): payload is IJWTpayload => {
  if (isString(payload)) {
    return false;
  }
  if ('_id' in payload) {
    return true;
  }
  return false;
};

export const verification: TMiddleWare<IReqWithCookies, IResWithVerifiedId> = (req, res, next) => {
  const token = req.cookies.authorization;

  if (!token) {
    return res.status(401).json({ err_message: 'token is not provieded', status: 'fail' });
  }

  if (!TOKEN_SECRET) {
    return res.status(401).json({ err_message: 'token secret is failed', status: 'fail' });
  }

  try {
    const jwtPaylod = jwt.verify(token, TOKEN_SECRET);

    if (!isJWTpayload(jwtPaylod)) {
      return res.status(401).json({ err_message: 'token is not correct', status: 'fail' });
    }

    res.locals.verifiedUserId = jwtPaylod._id;

    return next();
  } catch (err) {
    return res.status(400).json({ err_message: 'Access Denied', status: 'fail' });
  }
};
