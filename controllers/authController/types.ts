import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { TAsyncMiddleWare } from 'typings/middlewares';
import { ICredentialBody, ICredentialBodyNoEmail } from 'typings/requests';
import {
  TResVerifiedUsername,
  ISignUpResponse,
  IAppRes,
  ICheckCredResBody,
  ILocalsWithProfile,
} from 'typings/responses';

export type TSignUpHandler = TAsyncMiddleWare<
  Request<ParamsDictionary, ISignUpResponse, ICredentialBody>,
  Response<ISignUpResponse>
>;

export type TSignInHandler = TAsyncMiddleWare<
  Request<ParamsDictionary, ISignUpResponse, ICredentialBodyNoEmail>,
  Response<ISignUpResponse>
>;

export type TCheckCredHandler = TAsyncMiddleWare<
  Request<ParamsDictionary, ISignUpResponse, ICredentialBodyNoEmail>,
  IAppRes<ICheckCredResBody, ILocalsWithProfile>
>;

export type TLogoutHandler = TAsyncMiddleWare<Request<ParamsDictionary>, IAppRes>;
