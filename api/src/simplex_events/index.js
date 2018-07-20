import getEvents from './retrieveEvents'

import createLogger from 'logging'
const logger = createLogger('simplex_events/index.js')

getEvents()
  .then(() => {
    process.exit(0)
  })
  .catch(_error => {
    logger.error(_error)
    process.exit(1)
  })
