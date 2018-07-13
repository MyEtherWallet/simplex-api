import createLogger from 'logging'

import response from './response'
import {
    mobileValidation,
    recaptcha as recaptchaConfig
} from './config'
import {
    Recaptcha
} from 'express-recaptcha'

const logger = createLogger('sourceValidate.js')

const recaptcha = new Recaptcha(recaptchaConfig.siteKey, recaptchaConfig.secretKey)

export default function sourceyValidate (validationOptions = mobileValidation) {
    return function (req, res, next) {
            if (req.headers['referer'] === validationOptions.referrerAppleiOS || req.headers['referer'] === validationOptions.referrerAndroid) {
                if (validationOptions.apiKeys.includes(req.headers[validationOptions.apiKeyHeaderName])) {
                    req.recaptcha = {}
                    next()
                } else {
                    logger.error('Invalid API key')
                    response.error(res, 'Invalid API key')
                }
            } else {
                if (/quote/.test(req.route.path)) {
                    next()
                } else {
                    return recaptcha.middleware.verify(req, res, next)
                }
            }
    }
}
