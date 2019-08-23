import createLogger from 'logging'
import {
  simplex
} from '../config'
import request from 'request'
import debugLogger from 'debug'

const logger = createLogger('simplex/call.js')
const catchLogger = createLogger('simplex/call.js - catch')
const debugRequest = debugLogger('calls:request')

export default (body, path) => {
  return new Promise((resolve, reject) => {
    var options = {
      url: path,
      headers: {
        'Authorization': 'ApiKey ' + simplex.apiKey
      },
      body: body,
      method: 'post',
      json: true
    }
    let callback = (error, response, body) => {
      try {
        debugRequest(body)
        if (!error && response.statusCode === 200) {
          resolve(body)
        } else if (response.statusCode === 400) {
          reject(body)
          logger.error(body)
        } else {
          reject(error)
          logger.error(error)
        }
      } catch (e) {
        catchLogger.error(e)
      }
    }
    debugRequest(options)
    request(options, callback)
  })
}
