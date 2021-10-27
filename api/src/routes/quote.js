import createLogger from 'logging'
import debugLogger from 'debug'
import {
  getQuote
} from '../simplex'
import Validator from '../validator'
import uuidv4 from 'uuid/v4'
import response from '../response'
import {
  simplex,
  env
} from '../config'
import {
  Order
} from '../mangodb'
import sourceValidate from '../sourceValidate'
import {
  getIP
} from '../common'

const validationLogger = createLogger('quote.js - validation')
const logger = createLogger('quote.js')
const debugRequest = debugLogger('request:routes-quote')
const debugResponse = debugLogger('response:routes-quote')
const validationErrors = debugLogger('errors:validation')

let schema = {
  user_id: {
    type: String
  },
  digital_currency: {
    type: String,
    required: true,
    enum: simplex.validDigital,
    message: 'digital_currency required'
  },
  fiat_currency: {
    type: String,
    required: true,
    enum: simplex.validFiat,
    message: 'fiat_currency required'
  },
  requested_currency: {
    type: String,
    required: true,
    enum: simplex.validDigital.concat(simplex.validFiat),
    message: 'requested_currency required'
  },
  requested_amount: {
    type: Number,
    required: true,
    message: 'requested_amount required and must be a number'
  }
}

logger.info('TESTTTTTT ')

let validator = Validator(schema)
export default (app) => {
  app.post('/quote', sourceValidate(), (req, res) => {
    logger.info('1')
    let errors = validator.validate(req.body)
    validationErrors(errors)
    logger.info('2')
    if (errors.length) {
      validationLogger.error(errors)
      response.error(res, errors.map(_err => _err.message))
    } else {
      let userId = req.body.user_id ? req.body.user_id : uuidv4()
      let reqObj = Object.assign(req.body, {
        'end_user_id': userId,
        'wallet_id': simplex.walletID,
        'client_ip': env.mode === 'development' ? env.dev.ip : getIP(req)
      })
      debugRequest(reqObj)
      logger.info('3')
      getQuote(reqObj).then((result) => {
        logger.info('result', result)
        debugResponse(result)
        if (result.error) throw new Error(result.error);
        Order({
          user_id: userId,
          quote_id: result.quote_id,
          fiat_total_amount: {
            currency: result.fiat_money.currency,
            amount: result.fiat_money.total_amount
          },
          requested_digital_amount: {
            currency: result.digital_money.currency,
            amount: result.digital_money.amount
          },
          status: simplex.status.initiated,
          source: req.mewSourceApplication || 'web'
        }).save().catch((error) => {
          logger.error(error)
          response.error(res, error)
        })
        response.success(res, result)
      }).catch((error) => {
        logger.error(error)
        try {
          if (/[C|c]ountry/.test(error.message) && /supported/.test(error.message)) {
            response.error(res, 'Error_1')
          } else {
            response.error(res, error)
          }
        } catch (e) {
          logger.error(e)
        }
      })
    }
  })
}
