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

var _expressRecaptcha = require('express-recaptcha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var recaptcha = new _expressRecaptcha.Recaptcha(_config.recaptcha.siteKey, _config.recaptcha.secretKey);
var logger = (0, _logging2.default)('order.js');

var validateMinMax = function validateMinMax(val) {
    return !(_config.simplex.minFiat > +val || _config.simplex.maxFiat < +val);
};
var validateAddress = function validateAddress(val) {
    var maybeValid = _config.simplex.validDigital.filter(function (cryptoSymbol) {
        return _walletAddressValidator2.default.validate(val, cryptoSymbol);
    });
    logger.info(maybeValid);
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
            message: "app_end_user_id required min:12 max:64"
        }
    },
    transaction_details: {
        payment_details: {
            fiat_total_amount: {
                currency: {
                    type: String,
                    required: true,
                    enum: _config.simplex.validFiat,
                    message: "fiat currency required"
                },
                amount: {
                    type: Number,
                    required: true,
                    use: { validateMinMax: validateMinMax },
                    message: "fiat amount is required, must be a number, and must be between 50 and 20,000"
                }
            },
            requested_digital_amount: {
                currency: {
                    type: String,
                    required: true,
                    enum: _config.simplex.validDigital,
                    message: "requested currency required"
                },
                amount: {
                    type: Number,
                    required: true,
                    message: "requested amount required and must be a number"
                }
            },
            destination_wallet: {
                currency: {
                    type: String,
                    required: true,
                    enum: _config.simplex.validDigital,
                    message: "destination wallet currency required"
                },
                address: {
                    type: String,
                    required: true,
                    use: { validateAddress: validateAddress },
                    message: "destination address is required and must be a valid BTC or ETH address respectively"
                }
            }
        }
    }
};
var validator = (0, _validator2.default)(schema);
var validUserId = async function validUserId(_userId) {
    return new Promise(function (resolve, reject) {});
};
var getIP = function getIP(req) {
    return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
};

exports.default = function (app) {
    app.post('/order', /*recaptcha.middleware.verify,*/async function (req, res) {
        var errors = validator.validate(req.body);
        if (_config.env.mode != "development" && req.recaptcha.error) {
            logger.error(errors);
            _response2.default.error(res, req.recaptcha.error);
        } else if (errors.length) {
            logger.error(errors);
            _response2.default.error(res, errors.map(function (_err) {
                return _err.message;
            }));
        } else {
            var user_id = req.body.account_details.app_end_user_id;
            (0, _mangodb.getOrderById)(user_id).then(function (savedOrder) {
                var quote_id = savedOrder[0].quote_id;
                var payment_id = (0, _v2.default)();
                var order_id = (0, _v2.default)();
                var accept_language = _config.env.mode == "development" ? _config.env.dev.accept_language : req.headers['accept-language'];
                var ip = _config.env.mode == "development" ? _config.env.dev.ip : getIP(req);
                var user_agent = _config.env.mode == "development" ? _config.env.dev.user_agent : req.headers['User-Agent'];
                var reqObj = {
                    account_details: _extends({}, req.body.account_details, {
                        app_provider_id: _config.simplex.walletID,
                        app_version_id: _config.simplex.apiVersion,
                        signup_login: {
                            ip: ip,
                            uaid: user_id,
                            accept_language: accept_language,
                            http_accept_language: accept_language,
                            user_agent: user_agent,
                            cookie_session_id: user_id,
                            timestamp: new Date().toISOString()
                        }
                    }),
                    transaction_details: {
                        payment_details: _extends({}, req.body.transaction_details.payment_details, {
                            quote_id: quote_id,
                            payment_id: payment_id,
                            order_id: order_id,
                            original_http_ref_url: req.header('Referer')
                        })
                    }
                };
                (0, _mangodb.findAndUpdate)(user_id, {
                    payment_id: payment_id,
                    order_id: order_id,
                    status: _config.simplex.status.sentToSimplex
                }).catch(function (err) {
                    logger.error(err);
                });
                (0, _simplex.getOrder)(reqObj).then(function (result) {
                    if ("is_kyc_update_required" in result) {
                        _response2.default.success(res, {
                            payment_post_url: _config.simplex.paymentEP,
                            version: _config.simplex.apiVersion,
                            partner: _config.simplex.walletID,
                            return_url: "https://www.myetherwallet.com",
                            quote_id: quote_id,
                            payment_id: payment_id,
                            user_id: user_id,
                            destination_wallet_address: reqObj.transaction_details.payment_details.destination_wallet.address,
                            destination_wallet_currency: reqObj.transaction_details.payment_details.destination_wallet.currency,
                            fiat_total_amount_amount: reqObj.transaction_details.payment_details.fiat_total_amount.amount,
                            fiat_total_amount_currency: reqObj.transaction_details.payment_details.fiat_total_amount.currency,
                            digital_total_amount_amount: reqObj.transaction_details.payment_details.requested_digital_amount.amount,
                            digital_total_amount_currency: reqObj.transaction_details.payment_details.requested_digital_amount.currency
                        });
                    } else {
                        logger.error(result);
                        _response2.default.error(res, result);
                    }
                }).catch(function (error) {
                    logger.error(error);
                    _response2.default.error(res, error);
                });
            }).catch(function (err) {
                logger.error(err);
                _response2.default.error(res, "Invalid user_id");
            });
        }
    });
};