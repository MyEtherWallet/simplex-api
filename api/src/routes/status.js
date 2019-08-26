import response from '../response'
import createLogger from 'logging'
import {
  getOrderById
} from '../mangodb'
import Validator from '../validator'

const logger = createLogger('routes/status.js')
const loggerInvalidId = createLogger('routes/status.js - invalidId')

let schema = {
  user_id: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9-_]+$/,
    length: {
      min: 12,
      max: 64
    },
    message: 'user_id required min:12 max:64'
  }
}

let validator = Validator(schema)
export default (app) => {
  app.get('/status/:userId', (req, res) => {
    let errors = validator.validate({user_id: req.params.userId})
    if (errors.length) {
      response.error(res, 'invalid user id')
    } else {
      getOrderById(req.params.userId)
        .then(result => {
          if (result.length === 0) {
            loggerInvalidId.error(`UserId requested: ${req.params.userId}`)
            response.error(res, 'user id does not exist')
          } else {
            response.success(res, {
              user_id: result[0].user_id,
              status: result[0].status,
              fiat_total_amount: {
                currency: result[0].fiat_total_amount.currency,
                amount: result[0].fiat_total_amount.amount
              },
              requested_digital_amount: {
                currency: result[0].requested_digital_amount.currency,
                amount: result[0].requested_digital_amount.amount
              }
            })
          }
        })
        .catch((err) => {
          logger.error(err)
        })
    }
  })
}
