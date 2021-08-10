'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _mangodb = require('../mangodb');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debugRequest = (0, _debug2.default)('request:info');

exports.default = function (app) {
  app.get('/exchange-rates', function (req, res) {
    debugRequest('Exchange Rates Request Received');
    (0, _mangodb.getExchangeRates)(_config.simplex.baseCurrency).then(function (rates) {
      var cleanedRates = rates.map(function (item) {
        return {
          rate_currency: item.rate_currency,
          base_currency: item.base_currency,
          min: item.min,
          max: item.max,
          rate: item.rate,
          updatedAt: item.updatedAt
        };
      });
      _response2.default.success(res, {
        rates: cleanedRates
      });
    }).catch(function (error) {
      _response2.default.error(res, error);
    });
  });
};