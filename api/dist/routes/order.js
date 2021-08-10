'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _walletAddressValidator = require('wallet-address-validator');

var _walletAddressValidator2 = _interopRequireDefault(_walletAddressValidator);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _simplex = require('../simplex');

var _validator = require('../validator');

var _validator2 = _interopRequireDefault(_validator);

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _config = require('../config');

var _mangodb = require('../mangodb');

var _common = require('../common');

var _sourceValidate = require('../sourceValidate');

var _sourceValidate2 = _interopRequireDefault(_sourceValidate);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('order.js');
var catchLogger = (0, _logging2.default)('order.js - catch');
var debugRequest = (0, _debug2.default)('request:routes-order');
var debugResponse = (0, _debug2.default)('response:routes-order');
var validationErrors = (0, _debug2.default)('errors:validation');

var validateMinMax = function validateMinMax(val) {
  return !(_config.simplex.minFiat > +val || _config.simplex.maxFiat < +val);
};
var validateAddress = function validateAddress(val) {
  var maybeValid = _config.simplex.validDigital.filter(function (cryptoSymbol) {
    return _walletAddressValidator2.default.validate(val, cryptoSymbol);
  });
  return maybeValid.length > 0;
};

var schema = {
  account_details: {
    app_end_user_id: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9-_]+$/,
      length: {
        min: 12,
        max: 64
      },
      message: 'app_end_user_id required min:12 max:64'
    }
  },
  transaction_details: {
    payment_details: {
      quote_id: {
        type: String,
        // required: true,
        match: /^[a-zA-Z0-9-_]+$/,
        length: {
          min: 12,
          max: 64
        },
        message: 'app_end_user_id required min:12 max:64'
      },
      fiat_total_amount: {
        currency: {
          type: String,
          required: true,
          enum: _config.simplex.validFiat,
          message: 'fiat currency required'
        },
        amount: {
          type: Number,
          required: true,
          use: {
            validateMinMax: validateMinMax
          },
          message: 'fiat amount is required, must be a number, and must be between 50 and 20,000'
        }
      },
      requested_digital_amount: {
        currency: {
          type: String,
          required: true,
          enum: _config.simplex.validDigital,
          message: 'requested currency required'
        },
        amount: {
          type: Number,
          required: true,
          message: 'requested amount required and must be a number'
        }
      },
      destination_wallet: {
        currency: {
          type: String,
          required: true,
          enum: _config.simplex.validDigital,
          message: 'destination wallet currency required'
        },
        address: {
          type: String,
          required: true,
          use: {
            validateAddress: validateAddress
          },
          message: 'destination address is required and must be a valid BTC or ETH address respectively'
        }
      }
    }
  }
};
var validator = (0, _validator2.default)(schema);

var valueMatchCheck = function valueMatchCheck(bodyVals, dbVals) {
  var mustAllMatch = [];
  mustAllMatch.push(bodyVals.fiat_total_amount.amount === dbVals.fiat_total_amount.amount);
  mustAllMatch.push(bodyVals.fiat_total_amount.currency === dbVals.fiat_total_amount.currency);
  mustAllMatch.push(bodyVals.requested_digital_amount.amount === dbVals.requested_digital_amount.amount);
  mustAllMatch.push(bodyVals.requested_digital_amount.currency === dbVals.requested_digital_amount.currency);
  return mustAllMatch.every(function (value) {
    return value;
  });
};

exports.default = function (app) {
  app.post('/order', (0, _sourceValidate2.default)(), function (req, res) {
    try {
      var errors = validator.validate(req.body);
      validationErrors(errors);
      if (_config.env.mode !== 'development' && req.recaptcha.error) {
        logger.error('ERROR: env.mode !== \'development\' && req.recaptcha.error');
        logger.error(errors);
        logger.error(req.recaptcha.error);
        _response2.default.error(res, req.recaptcha.error);
      } else if (errors.length) {
        logger.error('Validation Error');
        logger.error(errors);
        _response2.default.error(res, errors.map(function (_err) {
          return _err.message;
        }));
      } else {
        var userId = req.body.account_details.app_end_user_id;
        var quoteIdOrig = req.body.transaction_details.payment_details.quote_id;
        (0, _mangodb.getOrderById)(userId, quoteIdOrig).then(function (savedOrder) {
          var quoteId = quoteIdOrig || savedOrder[0].quote_id;
          var paymentId = (0, _v2.default)();
          var orderId = (0, _v2.default)();
          var acceptLanguage = _config.env.mode === 'development' ? _config.env.dev.accept_language : req.headers['accept-language'];
          var ip = _config.env.mode === 'development' ? _config.env.dev.ip : (0, _common.getIP)(req);
          var userAgent = _config.env.mode === 'development' ? _config.env.dev.user_agent : req.headers['user-agent'];
          if (!valueMatchCheck(req.body.transaction_details.payment_details, savedOrder[0])) {
            throw Error('Mismatch between quoted values and order submission values');
          }
          var reqObj = {
            account_details: _extends({}, req.body.account_details, {
              app_provider_id: _config.simplex.walletID,
              app_version_id: _config.simplex.apiVersion,
              signup_login: {
                ip: ip,
                uaid: userId,
                accept_language: acceptLanguage,
                http_accept_language: acceptLanguage,
                user_agent: userAgent,
                cookie_session_id: userId,
                timestamp: new Date().toISOString()
              }
            }),
            transaction_details: {
              payment_details: _extends({}, req.body.transaction_details.payment_details, {
                quote_id: quoteId,
                payment_id: paymentId,
                order_id: orderId,
                original_http_ref_url: req.header('Referer')
              })
            }
          };
          (0, _mangodb.findAndUpdate)(userId, quoteId, {
            payment_id: paymentId,
            order_id: orderId,
            status: _config.simplex.status.sentToSimplex
          }).catch(function (err) {
            logger.error('findAndUpdate catch error');
            logger.error(err);
          });
          debugRequest(reqObj);
          (0, _simplex.getOrder)(reqObj).then(function (result) {
            debugResponse(result);
            if ('is_kyc_update_required' in result) {
              _response2.default.success(res, {
                payment_post_url: _config.simplex.paymentEP.replace(/\u200B/g, ''),
                version: _config.simplex.apiVersion,
                partner: _config.simplex.walletID,
                return_url: 'https://www.myetherwallet.com',
                quote_id: quoteId,
                payment_id: paymentId,
                user_id: userId,
                destination_wallet_address: reqObj.transaction_details.payment_details.destination_wallet.address,
                destination_wallet_currency: reqObj.transaction_details.payment_details.destination_wallet.currency,
                fiat_total_amount_amount: reqObj.transaction_details.payment_details.fiat_total_amount.amount,
                fiat_total_amount_currency: reqObj.transaction_details.payment_details.fiat_total_amount.currency,
                digital_total_amount_amount: reqObj.transaction_details.payment_details.requested_digital_amount.amount,
                digital_total_amount_currency: reqObj.transaction_details.payment_details.requested_digital_amount.currency
              });
            } else {
              logger.error('is_kyc_update_required error');
              logger.error(result);
              _response2.default.error(res, result);
            }
          }).catch(function (error) {
            logger.error('getOrder catch error');
            logger.error(error);
            _response2.default.error(res, error);
          });
        }).catch(function (err) {
          logger.error('getOrderById catch error');
          logger.error(err);
          _response2.default.error(res, 'Invalid userId');
        });
      }
    } catch (e) {
      catchLogger.error(e);
    }
  });
};