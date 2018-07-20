import response from '../response'
import createLogger from 'logging'
import {
  getOrderById
} from '../mangodb'

const logger = createLogger('routes/status.js')

export default (app) => {
  app.get('/status/:userId', (req, res) => {
    getOrderById(req.params.userId)
      .then(result => {
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
      })
      .catch((err) => {
        logger.error(err)
      })
  })
}
