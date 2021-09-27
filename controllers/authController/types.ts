import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { TAsyncMiddleWare } from 'typings/middlewares';
import { ICredentialBody } from 'typings/requests';
import { ISignUpResponse } from 'typings/responses';

export type TSignUpHandler = TAsyncMiddleWare<
  Request<ParamsDictionary, ISignUpResponse, ICredentialBody>,
  Response<ISignUpResponse>
>;
