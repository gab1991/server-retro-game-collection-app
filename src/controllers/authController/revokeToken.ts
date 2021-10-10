import { Response } from 'express';

export const revokeToken = (res: Response): void => {
  res.cookie('authorization', 'revoked', {
    maxAge: 0,
    httpOnly: true, // prevent accessing cookie from js
    sameSite: global.__IS_PROD__ ? 'strict' : 'lax',
    // secure: true  at first need to endable https
  });
};
