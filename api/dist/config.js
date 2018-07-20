'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config({
  path: '../.env'
});
var network = {
  port: process.env.PORT || 8080
};
var simplex = {
  walletID: process.env.WALLET_ID || '',
  quoteEP: process.env.QUOTE_EP || '',
  orderEP: process.env.ORDER_EP || '',
  paymentEP: process.env.PAYMENT_EP || '',
  eventEP: process.env.EVENT_EP || '',
  apiKey: process.env.SIMPLEX_APIKEY || '',
  apiVersion: '1',
  validFiat: ['EUR', 'USD'],
  validDigital: ['BTC', 'ETH'],
  status: {
    initiated: 'INITIATED',
    sentToSimplex: 'SENT_TO_SIMPLEX',
    deniedSimplex: 'DENIED_SIMPLEX',
    processingSimplex: 'PROCESSING_SIMPPLEX',
    successSimplex: 'SUCCESS_SIMPLEX'

  }
};
var mangodb = {
  host: process.env.DATA_MONGODB_HOST || 'localhost',
  port: 27017,
  name: 'gonano'
};
var recaptcha = {
  siteKey: process.env.RECAPTCHA_SITE_KEY || '',
  secretKey: process.env.RECAPTCHA_SECRET_KEY || ''
};
var env = {
  mode: process.env.NODE_ENV || 'production',
  dev: {
    ip: '141.145.165.137',
    accept_language: 'en-US,en;q=0.9',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
  }
};

var mobileValidation = {
  apiKeyHeaderName: process.env.API_KEY_HEADER || 'apikey',
  apiKeys: process.env.API_KEY ? [process.env.API_KEY] : ['321654987', 'abcdefg'],
  referrerAppleiOS: process.env.IOS_REFERER || 'iOS',
  referrerAndroid: process.env.ANDROID_REFERER || 'Android'
};

exports.network = network;
exports.simplex = simplex;
exports.mangodb = mangodb;
exports.recaptcha = recaptcha;
exports.env = env;
exports.mobileValidation = mobileValidation;