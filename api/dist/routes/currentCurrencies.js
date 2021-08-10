'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debugRequest = (0, _debug2.default)('request:info');

exports.default = function (app) {
  app.get('/current-currencies', function (req, res) {
    debugRequest('Current Currencies Request Received');
    var baseFiat = {
      USD: {
        symbol: 'USD',
        name: 'US Dollar'
      },
      EUR: {
        symbol: 'EUR',
        name: 'Euro'
      },
      CAD: {
        symbol: 'CAD',
        name: 'Canadian Dollar'
      },
      JPY: {
        symbol: 'JPY',
        name: 'Japanese Yen'
      }
    };
    var baseDigital = {
      BTC: {
        symbol: 'BTC',
        name: 'Bitcoin'
      },
      ETH: {
        symbol: 'ETH',
        name: 'Ether'
      }
    };

    var fiat = _config.simplex.validFiat.reduce(function (acc, curr) {
      if (baseFiat[curr]) {
        acc[curr] = baseFiat[curr];
      } else {
        acc[curr] = {
          symbol: curr,
          name: curr
        };
      }
      return acc;
    }, {});

    var digital = _config.simplex.validDigital.reduce(function (acc, curr) {
      if (baseDigital[curr]) {
        acc[curr] = baseDigital[curr];
      } else {
        acc[curr] = {
          symbol: curr,
          name: curr
        };
      }
      return acc;
    }, {});

    _response2.default.success(res, {
      fiat: fiat,
      digital: digital
    });
  });
};