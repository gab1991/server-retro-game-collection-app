import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET, TOKEN_EXPIRE, TOKEN_COOKIE_MAX_AGE } from 'midllewares';
import { AppError } from 'utils/AppError';

export const issueToken = (id: string, res: Response): void => {
  if (!TOKEN_SECRET) {
    throw new AppError('token secret has not been provided', 500);
  }

  const token = jwt.sign({ _id: id }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE });

  res.cookie('authorization', token, {
    maxAge: Number(TOKEN_COOKIE_MAX_AGE),
    httpOnly: true,
    sameSite: global.__IS_PROD__ ? 'strict' : 'lax',
    // secure: true  at first need to enable https
  });
};
