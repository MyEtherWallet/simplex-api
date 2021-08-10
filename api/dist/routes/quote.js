'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

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

var validationLogger = (0, _logging2.default)('quote.js - validation');
var logger = (0, _logging2.default)('quote.js');
var debugRequest = (0, _debug2.default)('request:routes-quote');
var debugResponse = (0, _debug2.default)('response:routes-quote');
var validationErrors = (0, _debug2.default)('errors:validation');

var schema = {
  user_id: {
    type: String
  },
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

logger.info('TESTTTTTT');

var validator = (0, _validator2.default)(schema);

exports.default = function (app) {
  app.post('/quote', (0, _sourceValidate2.default)(), function (req, res) {
    logger.info('1');
    var errors = validator.validate(req.body);
    validationErrors(errors);
    logger.info('2');
    if (errors.length) {
      validationLogger.error(errors);
      _response2.default.error(res, errors.map(function (_err) {
        return _err.message;
      }));
    } else {
      var userId = req.body.user_id ? req.body.user_id : (0, _v2.default)();
      var reqObj = Object.assign(req.body, {
        'end_user_id': userId,
        'wallet_id': _config.simplex.walletID,
        'client_ip': _config.env.mode === 'development' ? _config.env.dev.ip : (0, _common.getIP)(req)
      });
      debugRequest(reqObj);
      logger.info('3');
      (0, _simplex.getQuote)(reqObj).then(function (result) {
        logger.info('result', result);
        debugResponse(result);
        (0, _mangodb.Order)({
          user_id: userId,
          quote_id: result.quote_id,
          fiat_total_amount: {
            currency: result.fiat_money.currency,
            amount: result.fiat_money.total_amount
          },
          requested_digital_amount: {
            currency: result.digital_money.currency,
            amount: result.digital_money.amount
          },
          status: _config.simplex.status.initiated,
          source: req.mewSourceApplication || 'web'
        }).save().catch(function (error) {
          logger.error(error);
          _response2.default.error(res, error);
        });
        _response2.default.success(res, result);
      }).catch(function (error) {
        logger.error(error);
        try {
          if (/[C|c]ountry/.test(error.message) && /supported/.test(error.message)) {
            _response2.default.error(res, 'Error_1');
          } else {
            _response2.default.error(res, error);
          }
        } catch (e) {
          logger.error(e);
        }
      });
    }
  });
};