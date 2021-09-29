import { Request } from 'express';
import { IProfile } from 'models/types';

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

export interface IReqWithVerifiedId extends IReqWithCookies {
  verifiedUserId: string;
}

export interface IReqWithProfile extends IReqWithVerifiedId {
  profile: IProfile;
}
