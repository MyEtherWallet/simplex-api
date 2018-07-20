'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrder = exports.getQuote = undefined;

var _getQuote = require('./getQuote');

var _getQuote2 = _interopRequireDefault(_getQuote);

var _getOrder = require('./getOrder');

var _getOrder2 = _interopRequireDefault(_getOrder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getQuote = _getQuote2.default;
exports.getOrder = _getOrder2.default;