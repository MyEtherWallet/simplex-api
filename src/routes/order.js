import createLogger from 'logging'
import {
    getOrder
} from '../simplex'
import Validator from '../validator'
import response from '../response'
import {
    simplex
} from '../config'

const logger = createLogger('order.js')

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
            message: "app_end_user_id required min:12 max:64"
        },
        signup_login: {
            uaid: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                length: {
                    min: 12,
                    max: 128
                },
                message: "uaid required min:64 max:128"
            },
            accept_language: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_,=.;]+$/,
                message: "accept_language required"
            },
            http_accept_language: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_,=.;]+$/,
                message: "http_accept_language required"
            },
            user_agent: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_,=.;/ :()]+$/,
                message: "user_agent required"
            },
            cookie_session_id: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                message: "cookie_session_id required"
            }
        }
    },
    transaction_details: {
        payment_details: {
            quote_id: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                message: "quote_id required"
            },
            payment_id: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                message: "payment_id required"
            },
            order_id: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9-_]+$/,
                message: "order_id required"
            },
            fiat_total_amount: {
                currency: {
                    type: String,
                    required: true,
                    enum: simplex.validFiat,
                    message: "fiat currency required"
                },
                amount: {
                    type: Number,
                    required: true,
                    message: "fiat amount required and must be a number"
                }
            },
            requested_digital_amount: {
                currency: {
                    type: String,
                    required: true,
                    enum: simplex.validDigital,
                    message: "requested currency required"
                },
                amount: {
                    type: Number,
                    required: true,
                    message: "requested amount required and must be a number"
                }
            },
            destination_wallet: {
                currency: {
                    type: String,
                    required: true,
                    enum: simplex.validDigital,
                    message: "destination wallet currency required"
                },
                address: {
                    type: String,
                    required: true,
                    message: "destination address required and must be a number"
                }
            }
        }
    }
}
let validator = Validator(schema)
export default (app) => {
    app.post('/order', (req, res) => {
        let errors = validator.validate(req.body)
        if (errors.length) {
            logger.error(errors)
            response.error(res, errors.map(_err => _err.message))
        } else {
            let reqObj = {
                ...req.body,
                account_details: {
                    ...req.body.account_details,
                    app_provider_id: simplex.walletID,
                    app_version_id: "1",
                    signup_login: {
                        ...req.body.account_details.signup_login,
                        ip: '141.145.165.137',
                        timestamp: new Date().toISOString()
                    }
                },
                transaction_details: {
                    ...req.body.transaction_details,
                    payment_details: {
                        ...req.body.transaction_details.payment_details,
                        original_http_ref_url: req.header('Referer')
                    }
                }
            }
            getOrder(reqObj).then((result) => {
                logger.info(result)
                response.success(res, result)
            }).catch((error) => {
                logger.error(error)
                response.error(res, error)
            })
        }
    })
}