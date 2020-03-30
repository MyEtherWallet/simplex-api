import {minFiat, maxFiat, fiat, crypto} from '../currencyConfig';

let simplex = {
  validFiat: process.env.FIAT_CURRENCIES.split(',') || fiat,
  validDigital: process.env.DIGITAL_CURRENCIES.split(',') || crypto,
  minFiat: minFiat,
  maxFiat: maxFiat
};
let host = {
  url: process.env.API_HOST || 'http://172.20.0.2:8080'
};
let recaptcha = {
  siteKey: process.env.RECAPTCHA_SITE_KEY || ''
};
export {
  simplex,
  host,
  recaptcha
};
