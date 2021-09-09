require('dotenv').config();
const querystring = require('querystring');
const superagent = require('superagent');

const apiKey = process.env.EBAY_API_KEY;
const ebayFindingServiceUrl = process.env.EBAY_FINDING_SERVICE_URL;
const ebayGetItemUrl = process.env.EBAY_GET_ITEM_URL;

const findByKeywords = async (req, res) => {
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
    sortOrder,
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
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.items = data.findItemsByKeywordsResponse[0].searchResult;
    return res.send(res.items);
  } catch (err) {
    res.status(400).json({ err });
  }
};

const findSingleItem = async (req, res) => {
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
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.item = data;
    return res.send(res.item);
  } catch (err) {
    res.status(400).json({ err });
  }
};

const getShippingCost = async (req, res) => {
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
      res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.item = data;
    return res.send(res.item);
  } catch (err) {
    res.status(400).json({ err });
  }
};

module.exports = {
  findByKeywords,
  findSingleItem,
  getShippingCost,
};
