import {
    simplex
} from "../config"
import request from 'request'

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
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                reject(error)
            }
        }
        request(options, callback);
    })
}