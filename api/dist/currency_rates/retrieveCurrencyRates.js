'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mangodb = require('../mangodb');

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _config = require('../config');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('currency_rates/retrieveCurrencyRates.js');
var debugRequest = (0, _debug2.default)('calls:Events');

(0, _mangodb.connect)().then(function () {
  logger.info('mangodb running on port: ' + _config.mangodb.host + ':' + _config.mangodb.port);
}).catch(function (err) {
  logger.error('mangodb error: ' + err);
});

var multiply = function multiply(val1, val2) {
  return new _bignumber2.default(val1).times(new _bignumber2.default(val2)).toNumber();
};

var getExchangeRates = function getExchangeRates() {
  return new Promise(function (resolve, reject) {
    var currencies = _config.simplex.validFiat.join(',');
    var url = 'http://data.fixer.io/api/latest?access_key=' + _config.simplex.currencyApiKey + '&base=' + _config.simplex.baseCurrency + '&symbols=' + currencies + '&format=1';
    var options = {
      url: url,
      method: 'get',
      json: true
    };
    var retrieveCallback = function retrieveCallback(error, response, body) {
      try {
        if (!error && response.statusCode === 200) {
          logger.error(body);
          var rates = Object.keys(body.rates).reduce(function (prior, current) {
            prior.push({
              pair_key: body.base + current,
              base_currency: body.base,
              rate_currency: current,
              min: multiply(_config.simplex.minBaseCurrency, body.rates[current]),
              max: multiply(_config.simplex.maxBaseCurrency, body.rates[current]),
              rate: body.rates[current]
            });
            return prior;
          }, []);
          rates.forEach(updateItem);
          // processEvent
        } else if (response.statusCode === 400) {
          logger.error(response);
          reject(body);
        } else {
          logger.error(error);
          reject(error);
        }
      } catch (e) {
        logger.error(error);
        reject(error);
      }
    };
    debugRequest(options);
    (0, _request2.default)(options, retrieveCallback);
  });
};

function updateItem(recordItem) {
  (0, _mangodb.findAndUpdateExchangeRates)({
    pair_key: recordItem.pair_key
  }, recordItem).catch(function (err) {
    logger.error(err);
  });
}

exports.default = getExchangeRates;