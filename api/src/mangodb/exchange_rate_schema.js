import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'
let Schema = mongoose.Schema

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
})
ExchangeRateSchema.plugin(timestamp)
export default mongoose.model('ExchangeRate', ExchangeRateSchema)
