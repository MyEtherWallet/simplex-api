import createLogger from 'logging'
import {
    getQuote
} from '../simplex'
import Validator from '../validator'
import response from '../response'
import {
    simplex
} from '../config'

const logger = createLogger('quote.js')

let schema = {
    end_user_id: {
        type: String,
        required: true,
        match:/^[a-zA-Z0-9-_]+$/,
        length: {
            min: 12,
            max: 64
        },
        message: "end_user_id required min:12 max:64"
    },
    digital_currency: {
        type: String,
        required: true,
        enum: simplex.validDigital,
        message: "digital_currency required"
    },
    fiat_currency: {
        type: String,
        required: true,
        enum: simplex.validFiat,
        message: "fiat_currency required"
    },
    requested_currency: {
        type: String,
        required: true,
        enum: simplex.validDigital,
        message: "requested_currency required"
    },
    requested_amount: {
        type: Number,
        required: true,
        message: "requested_amount required and must be a number"
    }
}
let validator = Validator(schema)
export default (app) => {
    app.post('/quote', (req, res) => {
        let errors = validator.validate(req.body)
        if (errors.length) {
            logger.error(errors)
            response.error(res, errors.map(_err => _err.message))
        } else {
            let reqObj = Object.assign(req.body, {
                "wallet_id": simplex.walletID,
                "client_ip": '141.145.165.137'
            })
            getQuote(reqObj).then((result) => {
                logger.info(result)
                response.success(res, result)
            }).catch((error) => {
                logger.error(error)
                response.error(res, error)
            })
        }
    })
}