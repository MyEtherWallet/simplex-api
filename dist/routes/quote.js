'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _simplex = require('../simplex');

var _validator = require('../validator');

var _validator2 = _interopRequireDefault(_validator);

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('quote.js');

var schema = {
    end_user_id: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9-_]+$/,
        length: {
            min: 12,
            max: 64
        },
        message: "end_user_id required min:12 max:64"
    },
    digital_currency: {
        type: String,
        required: true,
        enum: _config.simplex.validDigital,
        message: "digital_currency required"
    },
    fiat_currency: {
        type: String,
        required: true,
        enum: _config.simplex.validFiat,
        message: "fiat_currency required"
    },
    requested_currency: {
        type: String,
        required: true,
        enum: _config.simplex.validDigital,
        message: "requested_currency required"
    },
    requested_amount: {
        type: Number,
        required: true,
        message: "requested_amount required and must be a number"
    }
};
var validator = (0, _validator2.default)(schema);

exports.default = function (app) {
    app.post('/quote', function (req, res) {
        var errors = validator.validate(req.body);
        if (errors.length) {
            logger.error(errors);
            _response2.default.error(res, errors.map(function (_err) {
                return _err.message;
            }));
        } else {
            var reqObj = Object.assign(req.body, {
                "wallet_id": _config.simplex.walletID,
                "client_ip": '141.145.165.137'
            });
            (0, _simplex.getQuote)(reqObj).then(function (result) {
                logger.info(result);
                _response2.default.success(res, result);
            }).catch(function (error) {
                logger.error(error);
                _response2.default.error(res, error);
            });
        }
    });
};