'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _validator = require('../validator');

var _validator2 = _interopRequireDefault(_validator);

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('order.js');
// import {
//     getQuote
// } from '../simplex'


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
        },
        signup_login: {
            uaid: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                length: {
                    min: 64,
                    max: 128
                },
                message: "uaid required min:64 max:128"
            },
            accept_language: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_,=.;]+$/,
                message: "accept_language required"
            },
            http_accept_language: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_,=.;]+$/,
                message: "http_accept_language required"
            },
            user_agent: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_,=.;/ :()]+$/,
                message: "user_agent required"
            },
            cookie_session_id: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                message: "cookie_session_id required"
            }
        },
        transaction_details: {
            quote_id: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                message: "quote_id required"
            },
            payment_id: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                message: "payment_id required"
            },
            order_id: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                message: "order_id required"
            },
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

exports.default = function (app) {
    app.post('/order', function (req, res) {
        var errors = validator.validate(req.body);
        if (errors.length) {
            logger.error(errors);
            _response2.default.error(res, errors.map(function (_err) {
                return _err.message;
            }));
        } else {
            var reqObj = Object.assign(req.body, {
                account_details: {
                    app_provider_id: _config.simplex.walletID,
                    app_version_id: "1",
                    signup_login: {
                        ip: '141.145.165.137',
                        timestamp: new Date().toISOString()
                    }
                },
                transaction_details: {
                    payment_details: {
                        original_http_ref_url: req.header('Referer')
                    }
                }
            });
            // getQuote(reqObj).then((result) => {
            //     logger.info(result)
            //     response.success(res, result)
            // }).catch((error) => {
            //     logger.error(error)
            //     response.error(res, error)
            // })
        }
    });
};