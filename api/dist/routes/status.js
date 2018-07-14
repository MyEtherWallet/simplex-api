'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _mangodb = require('../mangodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('routes/status.js');

exports.default = function (app) {
  app.get('/status/:userId', function (req, res) {
    (0, _mangodb.getOrderById)(req.params.userId).then(function (result) {
      _response2.default.success(res, {
        user_id: result[0].user_id,
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
    }).catch(function (err) {
      logger.error(err);
    });
  });
};