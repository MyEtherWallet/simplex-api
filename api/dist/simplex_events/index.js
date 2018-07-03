'use strict';

var _retrieveEvents = require('./retrieveEvents');

var _retrieveEvents2 = _interopRequireDefault(_retrieveEvents);

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('simplex_events/index.js');

(0, _retrieveEvents2.default)().then(function () {
  process.exit(0);
}).catch(function (_error) {
  logger.error(_error);
  process.exit(1);
});