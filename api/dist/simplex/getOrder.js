'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _call = require('./call');

var _call2 = _interopRequireDefault(_call);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('calls:getOrder');

exports.default = function (reqObject) {
  debug(reqObject); // todo remove dev item
  return (0, _call2.default)(reqObject, _config.simplex.orderEP);
};