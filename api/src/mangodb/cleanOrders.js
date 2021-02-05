import {
  connect,
} from './index'
import createLogger from 'logging'
import {
  mangodb,
  simplex
} from '../config'
import cron from 'node-cron'

import createLogger from 'logging'
const logger = createLogger('currency_rates/index.js')

const runCron = () => {
  console.log('cron setup for exchange rates')
  const cronTime = '0 * * * *'
  return cron.schedule(cronTime, () => {
    try {
      getRates()
        .then(() => {
          logger.info('FixerIO Rates Retrieved')
        })
        .catch(_error => {
          logger.error(_error)
        })
    } catch (e) {
      logger.error(e)
    }
  })
}

export default runCron
