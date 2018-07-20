'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validate = require('validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_schema) {
  var validator = new _validate2.default(_schema);
  return validator;
};