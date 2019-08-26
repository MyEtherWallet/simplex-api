import getEvents from './retrieveEvents'
import cron from 'node-cron'

import createLogger from 'logging'
const logger = createLogger('simplex_events/index.js')

//
// getEvents()
//   .then(() => {
//     process.exit(0)
//   })
//   .catch(_error => {
//     logger.error(_error)
//     process.exit(1)
//   })


const runCron = () => {
  console.log('cronning')
  const cronTime = '* * * * *'
  return cron.schedule(cronTime, () => {
    getEvents()
      .then(() => {
        logger.info('Simplex Events Retrieved')
        process.exit(0)
      })
      .catch(_error => {
        logger.error(_error)
        process.exit(1)
      })
  })
}

export default runCron
