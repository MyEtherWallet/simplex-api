import mongoose from 'mongoose'
import {
  mangodb
} from '../config'
import Order from './schema'
import EventSchema from './event_schema'
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
    sort: { 'created_at' : -1 }
    // quote_id: _quoteId
  })
}
let findAndUpdate = (_userId, _newVals) => {
  return Order.findOneAndUpdate({
    user_id: _userId
  }, _newVals)
}
export {
  connect,
  Order,
  EventSchema,
  getOrderById,
  findAndUpdate
}
