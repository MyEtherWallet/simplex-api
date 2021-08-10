'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ExchangeRateSchema = new Schema({
  pair_key: {
    type: String,
    required: true,
    unique: true
  },
  base_currency: {
    type: String,
    required: true
  },
  rate_currency: {
    type: String,
    sparse: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  }
});
ExchangeRateSchema.plugin(_mongooseTimestamp2.default);
exports.default = _mongoose2.default.model('ExchangeRate', ExchangeRateSchema);