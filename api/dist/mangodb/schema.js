'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var orderSchema = new Schema({
  user_id: {
    type: String,
    required: true
    // unique: true
  },
  quote_id: {
    type: String,
    unique: true,
    sparse: true
  },
  payment_id: {
    type: String,
    unique: true,
    sparse: true
  },
  order_id: {
    type: String,
    unique: true,
    sparse: true
  },
  fiat_total_amount: {
    currency: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  requested_digital_amount: {
    currency: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: Object.values(_config.simplex.status),
    required: true
  },
  source: {
    type: String,
    required: false
  }
});
orderSchema.plugin(_mongooseTimestamp2.default);
exports.default = _mongoose2.default.model('Order', orderSchema);