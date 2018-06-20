'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _simplex = require('../simplex');

var _validator = require('../validator');

var _validator2 = _interopRequireDefault(_validator);

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _config = require('../config');

var _mangodb = require('../mangodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('order.js');

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
                    message: "fiat amount required and must be a number"
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
                    message: "destination address required and must be a number"
                }
            }
        }
    }
};
var validator = (0, _validator2.default)(schema);
var validUserId = async function validUserId(_userId) {
    return new Promise(function (resolve, reject) {});
};

exports.default = function (app) {
    app.post('/order', async function (req, res) {
        var errors = validator.validate(req.body);
        if (errors.length) {
            logger.error(errors);
            _response2.default.error(res, errors.map(function (_err) {
                return _err.message;
            }));
        } else {
            var user_id = req.body.account_details.app_end_user_id;
            (0, _mangodb.getOrderById)(user_id).then(function (savedOrder) {
                var quote_id = savedOrder.quote_id;
                var payment_id = (0, _v2.default)();
                var order_id = (0, _v2.default)();
                var reqObj = {
                    account_details: _extends({}, req.body.account_details, {
                        app_provider_id: _config.simplex.walletID,
                        app_version_id: "1",
                        signup_login: {
                            ip: '141.145.165.137',
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
                    order_id: order_id
                }).catch(function (err) {
                    logger.error(err);
                });
                (0, _simplex.getOrder)(reqObj).then(function (result) {
                    _response2.default.success(res, result);
                }).catch(function (error) {
                    logger.error(error);
                    _response2.default.error(res, error);
                });
            }).catch(function () {
                _response2.default.error(res, "Invalid user_id");
            });
        }
    });
};