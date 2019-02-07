'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _simplex = require('../simplex');

var _validator = require('../validator');

var _validator2 = _interopRequireDefault(_validator);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _config = require('../config');

var _mangodb = require('../mangodb');

var _sourceValidate = require('../sourceValidate');

var _sourceValidate2 = _interopRequireDefault(_sourceValidate);

var _common = require('../common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('quote.js');

var schema = {
  digital_currency: {
    type: String,
    required: true,
    enum: _config.simplex.validDigital,
    message: 'digital_currency required'
  },
  fiat_currency: {
    type: String,
    required: true,
    enum: _config.simplex.validFiat,
    message: 'fiat_currency required'
  },
  requested_currency: {
    type: String,
    required: true,
    enum: _config.simplex.validDigital.concat(_config.simplex.validFiat),
    message: 'requested_currency required'
  },
  requested_amount: {
    type: Number,
    required: true,
    message: 'requested_amount required and must be a number'
  }
};

var validator = (0, _validator2.default)(schema);

exports.default = function (app) {
  app.post('/quote', (0, _sourceValidate2.default)(), function (req, res) {
    var errors = validator.validate(req.body);
    if (errors.length) {
      logger.error(errors);
      _response2.default.error(res, errors.map(function (_err) {
        return _err.message;
      }));
    } else {
      var newUserId = (0, _v2.default)();
      var reqObj = Object.assign(req.body, {
        'end_user_id': newUserId,
        'wallet_id': _config.simplex.walletID,
        'client_ip': _config.env.mode === 'development' ? _config.env.dev.ip : (0, _common.getIP)(req)
      });
      (0, _simplex.getQuote)(reqObj).then(function (result) {
        (0, _mangodb.Order)({
          user_id: newUserId,
          quote_id: result.quote_id,
          fiat_total_amount: {
            currency: result.fiat_money.currency,
            amount: result.fiat_money.total_amount
          },
          requested_digital_amount: {
            currency: result.digital_money.currency,
            amount: result.digital_money.amount
          },
          status: _config.simplex.status.initiated
        }).save().catch(function (error) {
          logger.error(error);
          _response2.default.error(res, error);
        });
        _response2.default.success(res, result);
      }).catch(function (error) {
        logger.error(error);
        if (/[C|c]ountry/.test(error.message) && /supported/.test(error.message)) {
          _response2.default.error(res, 'Error_1');
        } else {
          _response2.default.error(res, error);
        }
      });
    }
  });
};