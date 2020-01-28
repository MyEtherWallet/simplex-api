import mongoose from 'mongoose'
import {
  mangodb
} from '../config'
import Order from './schema'
import EventSchema from './event_schema'
import ExchangeRateSchema from './exchange_rate_schema'
let connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://' + mangodb.host + ':' + mangodb.port + '/' + mangodb.name)
    var db = mongoose.connection
    db.once('error', (error) => {
      reject(error)
    })
    db.once('open', () => {
      resolve()
    })
  })
}
let getOrderById = (_userId, _quoteId) => {
  // { sort: { 'created_at' : -1 } }
  return Order.find({
    user_id: _userId,
    // sort: { 'created_at' : -1 }
    // quote_id: _quoteId
  }).sort({ "created_at": -1 })
}
let findAndUpdate = (_userId, _quoteId, _newVals) => {
  return Order.findOneAndUpdate({
    user_id: _userId,
    quote_id: _quoteId
  }, _newVals)
}

let getExchangeRates = (base='USD') => {
  return ExchangeRateSchema.find({
    base_currency: base
  })
}

let findAndUpdateExchangeRates = (queryItem, rateItem) => {
  console.log(queryItem, rateItem); // todo remove dev item
  return ExchangeRateSchema.findOneAndUpdate(queryItem, rateItem, {upsert: true})
}

export {
  connect,
  Order,
  EventSchema,
  ExchangeRateSchema,
  getExchangeRates,
  findAndUpdateExchangeRates,
  getOrderById,
  findAndUpdate
}
