import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'
let Schema = mongoose.Schema

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
})
eventSchema.plugin(timestamp)
export default mongoose.model('EventRecord', eventSchema)
