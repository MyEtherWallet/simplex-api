import createLogger from 'logging'
import wav from 'wallet-address-validator'
import uuidv4 from 'uuid/v4'
import {
  getOrder
} from '../simplex'
import Validator from '../validator'
import response from '../response'
import {
  simplex,
  env
} from '../config'
import {
  getOrderById,
  findAndUpdate
} from '../mangodb'

import {
  getIP
} from '../common'

import sourceValidate from '../sourceValidate'
import debugLogger from 'debug'

const logger = createLogger('order.js')
const catchLogger = createLogger('order.js - catch')
const debugRequest = debugLogger('request:routes-order')
const debugResponse = debugLogger('response:routes-order')
const validationErrors = debugLogger('errors:validation')

const validateMinMax = val => {
  return !(simplex.minFiat > +val || simplex.maxFiat < +val)
}
const validateAddress = val => {
  const maybeValid = simplex.validDigital.filter(cryptoSymbol => {
    cryptoSymbol = cryptoSymbol === "BNB" || cryptoSymbol === "MATIC" ? "ETH" : cryptoSymbol;
    return wav.validate(val, cryptoSymbol)
  })
  return maybeValid.length > 0
}

let schema = {
  account_details: {
    app_end_user_id: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9-_]+$/,
      length: {
        min: 12,
        max: 64
      },
      message: 'app_end_user_id required min:12 max:64'
    }
  },
  transaction_details: {
    payment_details: {
      quote_id: {
        type: String,
        // required: true,
        match: /^[a-zA-Z0-9-_]+$/,
        length: {
          min: 12,
          max: 64
        },
        message: 'app_end_user_id required min:12 max:64'
      },
      fiat_total_amount: {
        currency: {
          type: String,
          required: true,
          enum: simplex.validFiat,
          message: 'fiat currency required'
        },
        amount: {
          type: Number,
          required: true,
          use: {
            validateMinMax
          },
          message: 'fiat amount is required, must be a number, and must be between 50 and 20,000'
        }
      },
      requested_digital_amount: {
        currency: {
          type: String,
          required: true,
          enum: simplex.validDigital,
          message: 'requested currency required'
        },
        amount: {
          type: Number,
          required: true,
          message: 'requested amount required and must be a number'
        }
      },
      destination_wallet: {
        currency: {
          type: String,
          required: true,
          enum: simplex.validDigital,
          message: 'destination wallet currency required'
        },
        address: {
          type: String,
          required: true,
          use: {
            validateAddress
          },
          message: 'destination address is required and must be a valid BTC or ETH address respectively'
        }
      }
    }
  }
}
let validator = Validator(schema)

const valueMatchCheck = (bodyVals, dbVals) => {
  const mustAllMatch = []
  mustAllMatch.push(bodyVals.fiat_total_amount.amount === dbVals.fiat_total_amount.amount)
  mustAllMatch.push(bodyVals.fiat_total_amount.currency === dbVals.fiat_total_amount.currency)
  mustAllMatch.push(bodyVals.requested_digital_amount.amount === dbVals.requested_digital_amount.amount)
  mustAllMatch.push(bodyVals.requested_digital_amount.currency === dbVals.requested_digital_amount.currency)
  return mustAllMatch.every(value => value)
}

export default (app) => {
  app.post('/order', sourceValidate(), (req, res) => {
    try {
      let errors = validator.validate(req.body)
      validationErrors(errors)
      if (env.mode !== 'development' && req.recaptcha.error) {
        logger.error('ERROR: env.mode !== \'development\' && req.recaptcha.error')
        logger.error(errors)
        logger.error(req.recaptcha.error)
        response.error(res, req.recaptcha.error)
      } else if (errors.length) {
        logger.error('Validation Error')
        logger.error(errors)
        response.error(res, errors.map(_err => _err.message))
      } else {
        let userId = req.body.account_details.app_end_user_id
        let quoteIdOrig = req.body.transaction_details.payment_details.quote_id
        getOrderById(userId, quoteIdOrig).then((savedOrder) => {
          let quoteId = quoteIdOrig || savedOrder[0].quote_id
          let paymentId = uuidv4()
          let orderId = uuidv4()
          let acceptLanguage = env.mode === 'development' ? env.dev.accept_language : req.headers['accept-language']
          let ip = env.mode === 'development' ? env.dev.ip : getIP(req)
          let userAgent = env.mode === 'development' ? env.dev.user_agent : req.headers['user-agent']
          if (!valueMatchCheck(req.body.transaction_details.payment_details, savedOrder[0])) {
            throw Error('Mismatch between quoted values and order submission values')
          }
          let reqObj = {
            account_details: {
              ...req.body.account_details,
              app_provider_id: simplex.walletID,
              app_version_id: simplex.apiVersion,
              signup_login: {
                ip: ip,
                uaid: userId,
                accept_language: acceptLanguage,
                http_accept_language: acceptLanguage,
                user_agent: userAgent,
                cookie_session_id: userId,
                timestamp: new Date().toISOString()
              }
            },
            transaction_details: {
              payment_details: {
                ...req.body.transaction_details.payment_details,
                quote_id: quoteId,
                payment_id: paymentId,
                order_id: orderId,
                original_http_ref_url: req.header('Referer')
              }
            }
          }
          findAndUpdate(userId, quoteId, {
            payment_id: paymentId,
            order_id: orderId,
            status: simplex.status.sentToSimplex
          }).catch((err) => {
            logger.error('findAndUpdate catch error')
            logger.error(err)
          })
          debugRequest(reqObj)
          getOrder(reqObj).then((result) => {
            debugResponse(result)
            if ('is_kyc_update_required' in result) {
              response.success(res, {
                payment_post_url: simplex.paymentEP.replace(/\u200B/g, ''),
                version: simplex.apiVersion,
                partner: simplex.walletID,
                return_url: 'https://www.myetherwallet.com',
                quote_id: quoteId,
                payment_id: paymentId,
                user_id: userId,
                destination_wallet_address: reqObj.transaction_details.payment_details.destination_wallet.address,
                destination_wallet_currency: reqObj.transaction_details.payment_details.destination_wallet.currency,
                fiat_total_amount_amount: reqObj.transaction_details.payment_details.fiat_total_amount.amount,
                fiat_total_amount_currency: reqObj.transaction_details.payment_details.fiat_total_amount.currency,
                digital_total_amount_amount: reqObj.transaction_details.payment_details.requested_digital_amount.amount,
                digital_total_amount_currency: reqObj.transaction_details.payment_details.requested_digital_amount.currency
              })
            } else {
              logger.error('is_kyc_update_required error')
              logger.error(result)
              response.error(res, result)
            }
          }).catch((error) => {
            logger.error('getOrder catch error')
            logger.error(error)
            response.error(res, error)
          })
        }).catch((err) => {
          logger.error('getOrderById catch error')
          logger.error(err)
          response.error(res, 'Invalid userId')
        })
      }
    } catch (e) {
      catchLogger.error(e)
    }
  })
}
