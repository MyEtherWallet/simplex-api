'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _config = require('../config');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('simplex/call.js');

exports.default = function (body, path) {
    return new Promise(function (resolve, reject) {
        var options = {
            url: path,
            headers: {
                'Authorization': 'ApiKey ' + _config.simplex.apiKey
            },
            body: body,
            method: "post",
            json: true
        };
        var callback = function callback(error, response, body) {
            if (!response) {
                logger.error('Undefined Response: ', response);
                reject(error);
            }
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else if (response.statusCode == 400) {
                reject(body);
            } else {
                reject(error);
            }
        };
        (0, _request2.default)(options, callback);
    });
};