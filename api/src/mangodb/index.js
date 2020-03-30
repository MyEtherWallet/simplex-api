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
  return new Promise((resolve, reject) => {
    if (_userId && _quoteId) {
      return Order.find({
        user_id: _userId,
        quote_id: _quoteId
      }).sort({'created_at': -1}).exec((err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    } else {
      return Order.find({
        user_id: _userId
      }).sort({'created_at': -1}).exec((err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    }
  })
}

let findAndUpdate = (_userId, _quoteId, _newVals) => {
  if (_quoteId && _newVals) {
    return Order.findOneAndUpdate({
      user_id: _userId,
      quote_id: _quoteId
    }, _newVals)
  } else if (!_quoteId && _newVals) {
    return Order.findOneAndUpdate({
      user_id: _userId
    }, _newVals)
  } else {
    return Order.findOneAndUpdate({
      user_id: _userId
    }, _quoteId) // in this case _paymentId contains the content of _newVals
  }
}

let findAndUpdateStatus = (_userId, _paymentId, _newVals) => {
  return Order.findOneAndUpdate({
    user_id: _userId,
    payment_id: _paymentId
  }, _newVals)
}

let getExchangeRates = (base = 'USD') => {
  return ExchangeRateSchema.find({
    base_currency: base
  })
}

let findAndUpdateExchangeRates = (queryItem, rateItem) => {
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
  findAndUpdate,
  findAndUpdateStatus
}
