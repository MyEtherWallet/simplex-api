const fiat = [
  "USD",
  "EUR",
  "CAD",
  "JPY",
  "GBP",
  "RUB",
  "AUD",
  "KRW",
  "CHF",
  "CZK",
  "DKK",
  "NOK",
  "NZD",
  "PLN",
  "SEK",
  "TRY",
  "ZAR",
  "HUF"
];
const crypto = ["BTC", "ETH", "BNB", "MATIC"];

const handler = function (defaultValue = 42) {
  return {
    get: function (target, name) {
      return target.hasOwnProperty(name) ? target[name] : defaultValue;
    }
  };
};

const minFiatTarget = { USD: 50, EUR: 50 };
const maxFiatTarget = { USD: 20000, EUR: 20000 };

const minFiat = new Proxy(minFiatTarget, handler(50));
const maxFiat = new Proxy(maxFiatTarget, handler(20000));

module.exports = {
  fiat,
  crypto,
  minFiat,
  maxFiat
};
