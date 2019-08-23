'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _retrieveEvents = require('./retrieveEvents');

var _retrieveEvents2 = _interopRequireDefault(_retrieveEvents);

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('simplex_events/index.js');

//
// getEvents()
//   .then(() => {
//     process.exit(0)
//   })
//   .catch(_error => {
//     logger.error(_error)
//     process.exit(1)
//   })

var cronTime = '* * * * *';

// cron.schedule(cronTime, () => {
//   getEvents()
//     .then(() => {
//       logger.info("Simplex Events Retrieved")
//       // process.exit(0)
//     })
//     .catch(_error => {
//       logger.error(_error)
//       // process.exit(1)
//     })
// })

var runCron = function runCron() {
  console.log('cronning');
  return _nodeCron2.default.schedule(cronTime, function () {
    (0, _retrieveEvents2.default)().then(function () {
      logger.info('Simplex Events Retrieved');
      // process.exit(0)
    }).catch(function (_error) {
      logger.error(_error);
      // process.exit(1)
    });
  });
};

exports.default = runCron;