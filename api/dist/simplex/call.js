'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _config = require('../config');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('simplex/call.js');
var catchLogger = (0, _logging2.default)('simplex/call.js - catch');
var debugRequest = (0, _debug2.default)('calls:request');

exports.default = function (body, path) {
  return new Promise(function (resolve, reject) {
    var options = {
      url: path,
      headers: {
        'Authorization': 'ApiKey ' + _config.simplex.apiKey
      },
      body: body,
      method: 'post',
      json: true
    };
    var callback = function callback(error, response, body) {
      try {
        debugRequest(body);
        if (!error && response.statusCode === 200) {
          resolve(body);
        } else if (response.statusCode === 400) {
          reject(body);
          logger.error(body);
        } else {
          reject(error);
          logger.error(error);
        }
      } catch (e) {
        catchLogger.error(e);
      }
    };
    debugRequest(options);
    (0, _request2.default)(options, callback);
  });
};