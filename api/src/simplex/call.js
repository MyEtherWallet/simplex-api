import createLogger from 'logging'
import {
    simplex
} from "../config"
import request from 'request'

const logger = createLogger('simplex/call.js')

export default (body, path) => {
    return new Promise((resolve, reject) => {
        var options = {
            url: path,
            headers: {
                'Authorization': 'ApiKey ' + simplex.apiKey
            },
            body: body,
            method: "post",
            json: true
        }
        let callback = (error, response, body) => {
            if(!response){
                logger.error('Undefined Response: ', response)
                reject(error)
            }
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else if (response.statusCode == 400) {
                reject(body)
            } else {
                reject(error)
            }
        }
        request(options, callback);
    })
}
