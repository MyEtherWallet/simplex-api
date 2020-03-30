import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'
import {
  simplex
} from '../config'
let Schema = mongoose.Schema

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
    enum: Object.values(simplex.status),
    required: true
  },
  source: {
    type: String,
    required: false
  }
})
orderSchema.plugin(timestamp)
export default mongoose.model('Order', orderSchema)
