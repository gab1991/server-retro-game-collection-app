import { Response } from 'express';
import { IProfile } from 'models/types';

export interface IAppResBody {
  err_message?: string;
  status: 'success' | 'fail';
}

export interface ISignUpResponse extends IAppResBody {
  field?: 'username' | 'email' | 'unknown' | 'password';
}

export type IAppRes<T extends IAppResBody, L extends Record<string, any>> = Response<T, L>;

interface ILocalsVerifiedID {
  verifiedUserId: string;
}

interface ILocalsWithProfile extends ILocalsVerifiedID {
  profile: IProfile;
}

export type IResWithVerifiedId = IAppRes<IAppResBody, ILocalsVerifiedID>;
export type IResWithProfile = IAppRes<IAppResBody, ILocalsWithProfile>;
