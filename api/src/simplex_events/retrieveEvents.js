import {
  connect,
  findAndUpdate,
  EventSchema
} from '../mangodb'
import eachOfSeries from 'async/eachOfSeries'
import createLogger from 'logging'
import {
  mangodb,
  simplex
} from '../config'
import request from 'request'
import debugLogger from 'debug'

const recordLogger = createLogger('simplex_events/retrieveEvents.js : record-event')
const logger = createLogger('simplex_events/retrieveEvents.js')
const debugRequest = debugLogger('calls:Events')

connect().then(() => {
  logger.info(`mangodb running on port: ${mangodb.host}:${mangodb.port}`)
}).catch((err) => {
  logger.error(`mangodb error: ${err}`)
})

let getEvents = () => {
  return new Promise((resolve, reject) => {
    let options = {
      url: simplex.eventEP,
      headers: {
        'Authorization': 'ApiKey ' + simplex.apiKey
      },
      method: 'get',
      json: true
    }
    let retrieveCallback = (error, response, body) => {
      console.log(body)
      if (!error && response.statusCode === 200) {
        eachOfSeries(body.events, processEvent, (error) => {
          if (error) {
            logger.error(response)
            reject(error)
          } else {
            resolve()
          }
        })
      } else if (response.statusCode === 400) {
        logger.error(response)
        reject(body)
      } else {
        logger.error(error)
        reject(error)
      }
    }
    debugRequest(options)
    request(options, retrieveCallback)
  })
}

function updateItem (recordItem, deleteCallback) {
  findAndUpdate(recordItem.payment.partner_end_user_id, {
    status: recordItem.payment.status
  }).catch((err) => {
    logger.error(err)
  })
  let options = {
    url: `${simplex.eventEP}/${recordItem.event_id}`,
    headers: {
      'Authorization': 'ApiKey ' + simplex.apiKey
    },
    method: 'DELETE',
    json: true
  }
  request(options, deleteCallback)
}

function processEvent (item, key, callback) {
  EventSchema(item)
    .save()
    .then(() => {
      updateItem(item, callback)
    })
    .catch((error) => {
      recordLogger.error(error)
      updateItem(item, callback)
    })
}

export default getEvents
