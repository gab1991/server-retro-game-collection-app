import { Response } from 'express';
import { IProfile } from 'models/types';
import { Document } from 'mongoose';

// BODIES
export interface IAppResBody<T = unknown> {
  err_message?: string;
  status: 'success' | 'fail';
  data?: T;
}

export interface ISignUpResponse extends IAppResBody {
  field?: 'username' | 'email' | 'unknown' | 'password';
}

export interface ICheckCredResBody extends IAppResBody {
  username: string;
}

// LOCALS
export interface ILocalsVerifiedID {
  verifiedUserId: string;
}

export interface ILocalsWithProfile extends ILocalsVerifiedID {
  profile: Document<any, any, IProfile> & IProfile;
}

// Responses
export type IAppRes<
  T extends IAppResBody = IAppResBody,
  L extends Record<string, any> = Record<string, any>
> = Response<T, L>;

export type IResWithVerifiedId = IAppRes<IAppResBody, ILocalsVerifiedID>;
export type IResWithProfile = IAppRes<IAppResBody, ILocalsWithProfile>;
export type TResVerifiedUsername = IAppRes<ICheckCredResBody, ILocalsWithProfile>;
