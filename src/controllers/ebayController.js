const superagent = require('superagent');
const EbayAuthToken = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayAuthToken({
  clientId: process.env.EBAY_CLIENT_ID,
  clientSecret: process.env.EBAY_CLIENT_SECRET,
  redirectUri: process.env.EBAY_REDIRECT_URL,
});

const apiKey = process.env.EBAY_CLIENT_ID;
const ebayFindingServiceUrl = process.env.EBAY_FINDING_SERVICE_URL;
const ebayGetItemUrl = process.env.EBAY_GET_ITEM_URL;

const RawgToEbayPlatformMap = {
  Genesis: 'Sega Genesis',
  NES: 'Nintendo NES',
  PlayStation: 'Sony PlayStation 1',
};

const findByKeywords = async (req, res) => {
  const { platform, gameName, sortOrder = 'BestMatch' } = req.params;

  const ebayPlatformname = RawgToEbayPlatformMap[platform];

  if (!ebayPlatformname) {
    return res.status(400).json({ err_message: 'No such platform available ' });
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
  const query = new URLSearchParams(queryParams).toString();

  const url = `${ebayFindingServiceUrl}?${query}`;

  try {
    const { status, text } = await superagent.get(url);
    const data = JSON.parse(text);

    if (status !== 200) {
      return res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.items = data.findItemsByKeywordsResponse[0].searchResult;

    return res.send(res.items);
  } catch (err) {
    return res.status(400).json({ err });
  }
};

const findSingleItem = async (req, res) => {
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

  try {
    const { status, text } = await superagent.get(url).set('X-EBAY-API-IAF-TOKEN', token);
    const data = JSON.parse(text);

    // if (data.Ack !== 'Success') {
    //   res.status(status).send({ err: "Couldn't fetch data from rawg" });
    // }

    return res.json(data);
  } catch (err) {
    return res.status(400).json({ err });
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

  const query = new URLSearchParams(queryParams).toString();
  const url = `${ebayGetItemUrl}?${query}`;

  const token = await ebayAuthToken.getApplicationToken('PRODUCTION');

  try {
    const { status, text } = await superagent.get(url).set('X-EBAY-API-IAF-TOKEN', token);
    const data = JSON.parse(text);

    if (status !== 200) {
      return res.status(status).send({ err: "Couldn't fetch data from rawg" });
    }

    res.item = data;
    return res.send(res.item);
  } catch (err) {
    return res.status(400).json({ err });
  }
};

module.exports = {
  findByKeywords,
  findSingleItem,
  getShippingCost,
};
