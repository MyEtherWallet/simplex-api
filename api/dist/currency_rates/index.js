'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _retrieveCurrencyRates = require('./retrieveCurrencyRates');

var _retrieveCurrencyRates2 = _interopRequireDefault(_retrieveCurrencyRates);

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('currency_rates/index.js');

var runCron = function runCron() {
  console.log('cron setup for exchange rates');
  var cronTime = '0 * * * *';
  return _nodeCron2.default.schedule(cronTime, function () {
    try {
      (0, _retrieveCurrencyRates2.default)().then(function () {
        logger.info('FixerIO Rates Retrieved');
      }).catch(function (_error) {
        logger.error(_error);
      });
    } catch (e) {
      logger.error(e);
    }
  });
};

exports.default = runCron;