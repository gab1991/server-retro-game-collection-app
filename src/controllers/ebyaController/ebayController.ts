import superagent from 'superagent';
import EbayAuthToken from 'ebay-oauth-nodejs-client';
import { AvailablePlatforms } from 'models/types';
import { asyncErrorCatcher } from 'utils/asyncErrorCatcher';
import { AppError } from 'utils/AppError';
import { isAvailablePlatform } from 'typings/typeguards/profile';
import { TFindByKeywordsHandler, TFindSingleElementHandler, TGetShippingCostHandler } from './types';

export const ebayAuthToken = new EbayAuthToken({
  clientId: process.env.EBAY_CLIENT_ID,
  clientSecret: process.env.EBAY_CLIENT_SECRET,
  redirectUri: process.env.EBAY_REDIRECT_URL,
});

const apiKey = process.env.EBAY_CLIENT_ID;
const ebayFindingServiceUrl = process.env.EBAY_FINDING_SERVICE_URL;
const ebayGetItemUrl = process.env.EBAY_GET_ITEM_URL;

const RawgToEbayPlatformMap: { [key in AvailablePlatforms]: string } = {
  Genesis: 'Sega Genesis',
  NES: 'Nintendo NES',
  PlayStation: 'Sony PlayStation 1',
};

export const findByKeywords = asyncErrorCatcher<TFindByKeywordsHandler>(async (req, res, next) => {
  const { platform, gameName, sortOrder = 'BestMatch' } = req.params;

  if (!apiKey) {
    return next(new AppError(`api key has not been found`, 500));
  }

  if (!isAvailablePlatform(platform) || !gameName || !sortOrder) {
    return next(new AppError(`some of params is wrong`, 400));
  }

  const ebayPlatformname = RawgToEbayPlatformMap[platform];

  const queryParams = {
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-NAME': 'FindingService',
    'SERVICE-VERSION': '1.0.0',
    'GLOBAL-ID': 'EBAY-US',
    'SECURITY-APPNAME': apiKey,
    'RESPONSE-DATA-FORMAT': 'JSON',
    sortOrder,
    keywords: gameName,
    'aspectFilter(0).aspectName': 'Platform',
    'aspectFilter(0).aspectValueName': ebayPlatformname,
  };

  const query = new URLSearchParams(queryParams).toString();
  const url = `${ebayFindingServiceUrl}?${query}`;

  const { status, text } = await superagent.get(url);

  if (status !== 200) {
    return next(new AppError(`couldn't fetch data from ebay`, 500));
  }

  const data = JSON.parse(text);

  return res.json(data.findItemsByKeywordsResponse[0].searchResult);
});

export const findSingleItem = asyncErrorCatcher<TFindSingleElementHandler>(async (req, res) => {
  const { id } = req.params;

  const token = await ebayAuthToken.getApplicationToken('PRODUCTION');

  const queryParams = {
    callname: 'GetSingleItem',
    responseencoding: 'JSON',
    siteid: '0',
    version: '967',
    ItemID: id,
    IncludeSelector: 'Description,ItemSpecifics,ShippingCosts',
  };

  const query = new URLSearchParams(queryParams).toString();
  const url = `${ebayGetItemUrl}?${query}`;

  const { text } = await superagent.get(url).set('X-EBAY-API-IAF-TOKEN', token);
  const data = JSON.parse(text);

  return res.json(data);
});

export const getShippingCost = asyncErrorCatcher<TGetShippingCostHandler>(async (req, res, next) => {
  const { id, countryCode, postalCode } = req.params;

  if (!apiKey) {
    return next(new AppError(`api key has not been found`, 500));
  }

  const queryParams = {
    callname: 'GetShippingCosts',
    responseencoding: 'JSON',
    // appid: apiKey,
    siteid: '0',
    version: '517',
    ItemID: id,
    QuantitySold: '1',
    IncludeDetails: 'true',
    DestinationCountryCode: countryCode || 'RU',
    DestinationPostalCode: postalCode || '',
  };

  const query = new URLSearchParams(queryParams).toString();
  const url = `${ebayGetItemUrl}?${query}`;

  const token = await ebayAuthToken.getApplicationToken('PRODUCTION');

  const { status, text } = await superagent.get(url).set('X-EBAY-API-IAF-TOKEN', token);
  const data = JSON.parse(text);

  if (status !== 200) {
    return next(new AppError(`couldn't fetch data from ebay`, 500));
  }

  return res.json(data);
});
