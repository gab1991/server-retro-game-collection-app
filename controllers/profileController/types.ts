import { Request } from 'express';
import { IProfile } from 'models/types';
import { TMiddleWare } from 'typings/middlewares';
import { IAppRes, IAppResBody, ILocalsWithProfile } from 'typings/responses';

type IResGetProfile = IAppRes<IAppResBody<IProfile>, ILocalsWithProfile>;

export type TGetProfileHandler = TMiddleWare<Request, IResGetProfile>;
