import getEvents from './retrieveEvents'
import cron from 'node-cron'

import createLogger from 'logging'
const logger = createLogger('simplex_events/index.js')

const runCron = () => {
  console.log('cron setup for simplex events')
  const cronTime = '* * * * *'
  return cron.schedule(cronTime, () => {
    try {
      getEvents()
        .then(() => {
          logger.info('Simplex Events Retrieved')
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
