'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _mangodb = require('../mangodb');

var _validator = require('../validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('routes/status.js');
var loggerInvalidId = (0, _logging2.default)('routes/status.js - invalidId');

var schema = {
  user_id: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9-_]+$/,
    length: {
      min: 12,
      max: 64
    },
    message: 'user_id required min:12 max:64'
  },
  quote_id: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9-_]+$/,
    length: {
      min: 12,
      max: 64
    },
    message: 'quote_id required min:12 max:64'
  }
};

var validator = (0, _validator2.default)(schema);

exports.default = function (app) {
  app.get('/status/:userId/:quoteId', function (req, res) {
    var errors = validator.validate({ user_id: req.params.userId, quote_id: req.params.quoteId });
    if (errors.length) {
      _response2.default.error(res, 'invalid user or quote id');
    } else {
      (0, _mangodb.getOrderById)(req.params.userId, req.params.quoteId).then(function (result) {
        if (result.length === 0) {
          loggerInvalidId.error('UserId requested: ' + req.params.userId);
          _response2.default.error(res, 'user id does not exist');
        } else {
          _response2.default.success(res, {
            user_id: result[0].user_id,
            quote_id: result[0].quote_id,
            status: result[0].status,
            fiat_total_amount: {
              currency: result[0].fiat_total_amount.currency,
              amount: result[0].fiat_total_amount.amount
            },
            requested_digital_amount: {
              currency: result[0].requested_digital_amount.currency,
              amount: result[0].requested_digital_amount.amount
            }
          });
        }
      }).catch(function (err) {
        logger.error(err);
      });
    }
  });
};