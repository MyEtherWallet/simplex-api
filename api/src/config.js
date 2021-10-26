import { fiat, crypto } from "../currencyConfig";

require("dotenv").config({
  path: "../../.env"
});

let network = {
  port: process.env.PORT || 8080
};
let simplex = {
  walletID: process.env.WALLET_ID || "",
  quoteEP: process.env.QUOTE_EP || "",
  orderEP: process.env.ORDER_EP || "",
  paymentEP: process.env.PAYMENT_EP || "",
  eventEP: process.env.EVENT_EP || "",
  apiKey: process.env.SIMPLEX_APIKEY || "",
  apiVersion: "1",
  validFiat: process.env.FIAT_CURRENCIES
    ? process.env.FIAT_CURRENCIES.split(",")
    : fiat, // ['USD','EUR'],
  validDigital: process.env.DIGITAL_CURRENCIES
    ? process.env.DIGITAL_CURRENCIES.split(",")
    : crypto, // ['BTC', 'BSC', 'ETH'],
  currencyApiKey: process.env.FIXER_APIKEY || "",
  baseCurrency: process.env.BASE_CURRENCY || "USD",
  minBaseCurrency: process.env.FIAT_MIN_USD || 50, // USD
  maxBaseCurrency: process.env.FIAT_MAX_USD || 20000, // USD
  status: {
    initiated: "INITIATED",
    sentToSimplex: "SENT_TO_SIMPLEX",
    deniedSimplex: "DENIED_SIMPLEX",
    processingSimplex: "PROCESSING_SIMPPLEX",
    successSimplex: "SUCCESS_SIMPLEX"
  }
};
let mangodb = {
  host: process.env.DATA_MONGODB_HOST || "localhost",
  port: 27017,
  name: "gonano"
};
let recaptcha = {
  siteKey: process.env.RECAPTCHA_SITE_KEY || "",
  secretKey: process.env.RECAPTCHA_SECRET_KEY || ""
};
let env = {
  mode: process.env.NODE_ENV || "production",
  dev: {
    ip: "141.145.165.137",
    accept_language: "en-US,en;q=0.9",
    user_agent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36"
  }
};

let productValidation = {
  apiKeyHeaderName: process.env.API_KEY_HEADER || "apikey",
  apiKeys: process.env.API_KEY
    ? [process.env.API_KEY]
    : ["321654987", "abcdefg"],
  referrerAppleiOS: process.env.IOS_REFERER || "iOS",
  referrerAndroid: process.env.ANDROID_REFERER || "Android",
  specialWebOrigins: process.env.SPECIAL_WEB_ORIGINS
    ? process.env.SPECIAL_WEB_ORIGINS.split(",")
    : []
};

export { network, simplex, mangodb, recaptcha, env, productValidation };
