'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mangodb = require('../mangodb');

var _eachOfSeries = require('async/eachOfSeries');

var _eachOfSeries2 = _interopRequireDefault(_eachOfSeries);

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _config = require('../config');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var recordLogger = (0, _logging2.default)('simplex_events/retrieveEvents.js : record-event');
var logger = (0, _logging2.default)('simplex_events/retrieveEvents.js');
var debugRequest = (0, _debug2.default)('calls:Events');

(0, _mangodb.connect)().then(function () {
  logger.info('mangodb running on port: ' + _config.mangodb.host + ':' + _config.mangodb.port);
}).catch(function (err) {
  logger.error('mangodb error: ' + err);
});

var getEvents = function getEvents() {
  return new Promise(function (resolve, reject) {
    var options = {
      url: _config.simplex.eventEP,
      headers: {
        'Authorization': 'ApiKey ' + _config.simplex.apiKey
      },
      method: 'get',
      json: true
    };
    var retrieveCallback = function retrieveCallback(error, response, body) {
      try {
        if (!error && response.statusCode === 200) {
          (0, _eachOfSeries2.default)(body.events, processEvent, function (error) {
            if (error) {
              logger.error(response);
              reject(error);
            } else {
              resolve();
            }
          });
        } else if (response.statusCode === 400) {
          logger.error(response);
          reject(body);
        } else {
          logger.error(error);
          reject(error);
        }
      } catch (e) {
        logger.error(error);
        reject(error);
      }
    };
    debugRequest(options);
    (0, _request2.default)(options, retrieveCallback);
  });
};

function updateItem(recordItem, deleteCallback) {
  (0, _mangodb.findAndUpdateStatus)(recordItem.payment.partner_end_user_id, recordItem.payment.id, {
    status: recordItem.payment.status
  }).then(function (resp) {
    if (resp) {
      var options = {
        url: _config.simplex.eventEP + '/' + recordItem.event_id,
        headers: {
          'Authorization': 'ApiKey ' + _config.simplex.apiKey
        },
        method: 'DELETE',
        json: true
      };
      (0, _request2.default)(options, deleteCallback);
    } else {
      (0, _mangodb.findAndUpdate)(recordItem.payment.partner_end_user_id, {
        status: recordItem.payment.status
      }).then(function (resp) {
        if (resp) {
          var _options = {
            url: _config.simplex.eventEP + '/' + recordItem.event_id,
            headers: {
              'Authorization': 'ApiKey ' + _config.simplex.apiKey
            },
            method: 'DELETE',
            json: true
          };
          (0, _request2.default)(_options, deleteCallback);
        } else {
          console.log('Unknown IDs: ', recordItem.payment.partner_end_user_id, recordItem.payment.id); // todo remove dev item
        }
      }).catch(function (err) {
        logger.error(err);
      });
    }
  }).catch(function (err) {
    logger.error(err);
  });
}

function processEvent(item, key, callback) {
  (0, _mangodb.EventSchema)(item).save().then(function () {
    updateItem(item, callback);
  }).catch(function (error) {
    recordLogger.error(error);
    updateItem(item, callback);
  });
}

exports.default = getEvents;