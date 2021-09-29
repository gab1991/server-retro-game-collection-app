import { Request, Response } from 'express';

export interface ICredentialBody {
  username: string;
  email: string;
  password: string;
}

export type ICredentialBodyNoEmail = Omit<ICredentialBody, 'email'>;

export interface IReqWithCookies extends Request {
  cookies: {
    authorization: string;
  };
}
