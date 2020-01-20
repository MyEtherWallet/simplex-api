import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'
import {
  simplex
} from '../config'
let Schema = mongoose.Schema

var ExchangeRateSchema = new Schema({
  base_currency: {
    type: String,
    required: true,
    unique: true
  },
  rate_currency: {
    type: String,
    unique: true,
    sparse: true
  },
  rate: {
    type: Number,
    required: true
  }
})
ExchangeRateSchema.plugin(timestamp)
export default mongoose.model('ExchangeRate', ExchangeRateSchema)
