'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _call = require('./call');

var _call2 = _interopRequireDefault(_call);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (reqObject) {
    return (0, _call2.default)(reqObject, _config.simplex.orderEP);
};