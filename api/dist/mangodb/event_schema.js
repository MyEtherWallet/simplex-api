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

var eventSchema = new Schema({
  event_id: {
    type: String
  },
  name: {
    type: String
  },
  payment: {
    id: {
      type: String
    },
    status: {
      type: String
    },
    created_at: {
      type: String
    },
    updated_at: {
      type: String
    },
    partner_end_user_id: {
      type: String
    },
    fiat_total_amount: {
      currency: {
        type: String
      },
      amount: {
        type: Number
      }
    }
  },
  timestamp: {
    type: String
  }
});
eventSchema.plugin(_mongooseTimestamp2.default);
exports.default = _mongoose2.default.model('EventRecord', eventSchema);