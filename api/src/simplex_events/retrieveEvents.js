import {
    connect,
    findAndUpdate
} from '../mangodb'
import eachOfSeries from 'async/eachOfSeries';
import createLogger from 'logging'
import {
    mangodb,
    simplex
} from '../config'
import request from 'request'

const logger = createLogger('simplex_events/retrieveEvents.js')

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
        let callback = (error, response, body) => {
            if (!error && response.statusCode === 200) {
                eachOfSeries(body.events, processEvent, (error) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve()
                    }
                })
            } else if (response.statusCode === 400) {
                reject(body)
            } else {
                reject(error)
            }
        }
        request(options, callback)
    })
}

let processEvent = (item, key, callback) => {
    findAndUpdate(item.payment.partner_end_user_id, {
        status: item.payment.status
    }).catch((err) => {
        logger.error(err)
    })
    let options = {
        url: `${simplex.eventEP}/${item.event_id}`,
        headers: {
            'Authorization': 'ApiKey ' + simplex.apiKey
        },
        method: 'DELETE',
        json: true
    }
    request(options, callback)
}

export default getEvents