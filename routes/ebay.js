require('dotenv').config();
const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const superagent = require('superagent');
const apiKey = process.env.EBAY_API_KEY;
const ebayFindingServiceUrl = process.env.EBAY_FINDING_SERVICE_URL;
const ebayGetItemUrl = process.env.EBAY_GET_ITEM_URL;

router.get('/searchList/:platform/:gameName/:sortOrder', findByKeywords, async (req, res) => {
  try {
    res.send(res.items);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/singleItem/:id', findSingleItem, async (req, res) => {
  try {
    res.send(res.item);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/shopingCosts/:id', getShippingCost, async (req, res) => {
  try {
    res.send(res.item);
  } catch (err) {
    res.status(400).send(err);
  }
});

async function findByKeywords(req, res, next) {
  const { platform, gameName, sortOrder = 'BestMatch' } = req.params;
  let ebayPlatformname;
  switch (platform) {
    case 'Genesis':
      ebayPlatformname = 'Sega Genesis';
      break;
    case 'NES':
      ebayPlatformname = 'Nintendo NES';
      break;
    case 'PlayStation':
      ebayPlatformname = 'Sony PlayStation 1';
      break;
    default:
      ebayPlatformname = '';
  }

  const queryParams = {
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-NAME': 'FindingService',
    'SERVICE-VERSION': '1.0.0',
    'GLOBAL-ID': 'EBAY-US',
    'SECURITY-APPNAME': apiKey,
    'RESPONSE-DATA-FORMAT': 'JSON',
    sortOrder: sortOrder,
    keywords: gameName,
    'aspectFilter(0).aspectName': 'Platform',
    'aspectFilter(0).aspectValueName': ebayPlatformname,
  };
  const query = querystring.encode(queryParams);

  const url = `${ebayFindingServiceUrl}?${query}`;

  try {
    const { text, status } = await superagent.get(url);
    const data = JSON.parse(text);

    if (status !== 200) {
      res.status(status).send({ err: `Couldn't fetch data from rawg` });
    }

    res.items = data.findItemsByKeywordsResponse[0].searchResult;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ err });
  }
}

let call = 0;
async function findSingleItem(req, res, next) {
  const { id } = req.params;

  const queryParams = {
    callname: 'GetSingleItem',
    responseencoding: 'JSON',
    appid: apiKey,
    siteid: '0',
    version: '967',
    ItemID: id,
    IncludeSelector: 'Description,ItemSpecifics,ShippingCosts',
  };

  const query = querystring.encode(queryParams);
  const url = `${ebayGetItemUrl}?${query}`;

  try {
    const { status, text } = await superagent.get(url);
    const data = JSON.parse(text);

    if (status !== 200) {
      res.status(status).send({ err: `Couldn't fetch data from rawg` });
    }

    res.item = data;
    next();
  } catch (err) {
    res.status(400).json({ err });
  }
}

async function getShippingCost(req, res, next) {
  const { id, countryCode, postalCode } = req.params;

  const queryParams = {
    callname: 'GetShippingCosts',
    responseencoding: 'JSON',
    appid: apiKey,
    siteid: '0',
    version: '517',
    ItemID: id,
    QuantitySold: 1,
    IncludeDetails: true,
    DestinationCountryCode: countryCode || 'RU',
    DestinationPostalCode: postalCode || '',
  };

  const query = querystring.encode(queryParams);
  const url = `${ebayGetItemUrl}?${query}`;

  try {
    const { status, text } = await superagent.get(url);
    const data = JSON.parse(text);

    if (status !== 200) {
      res.status(status).send({ err: `Couldn't fetch data from rawg` });
    }

    res.item = data;
    next();
  } catch (err) {
    res.status(400).json({ err });
  }
}
module.exports = router;
