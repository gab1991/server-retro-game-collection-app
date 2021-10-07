import { Request } from 'express';
import { IAppRes, IAppResBody } from 'typings/responses';
import { ParamsDictionary } from 'express-serve-static-core';
import { TAsyncMiddleWare } from 'typings/middlewares';

// FindByKeywords
interface IReqFindByKeywordsParams {
  [key: string]: string;
  sortOrder: string;
  gameName: string;
  platform: string;
}
type IResFindByKeywords = IAppRes<IAppResBody>;
type TReqFindByKeywords = Request<ParamsDictionary | IReqFindByKeywordsParams, IResFindByKeywords>;
export type TFindByKeywordsHandler = TAsyncMiddleWare<TReqFindByKeywords, IResFindByKeywords>;

// FindSingleElement
interface IReqFindSingleElementsParams {
  [key: string]: string;
  id: string;
}
type IResFindSingleElement = IAppRes<IAppResBody>;
type TReqFindSingleElement = Request<ParamsDictionary | IReqFindSingleElementsParams, IResFindSingleElement>;
export type TFindSingleElementHandler = TAsyncMiddleWare<TReqFindSingleElement, IResFindSingleElement>;

// GetShippingCost
interface IReqGetShippingCostsParams {
  [key: string]: string;
  id: string;
  countryCode: string;
  postalCode: string;
}
type IResGetShippingCost = IAppRes<IAppResBody>;
type TReqGetShippingCost = Request<ParamsDictionary | IReqGetShippingCostsParams, IResGetShippingCost>;
export type TGetShippingCostHandler = TAsyncMiddleWare<TReqGetShippingCost, IResGetShippingCost>;
