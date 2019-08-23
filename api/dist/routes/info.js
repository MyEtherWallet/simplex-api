'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var packageInfo = require('../../package.json');

var debugRequest = (0, _debug2.default)('request:info');

exports.default = function (app) {
  app.get('/info', function (req, res) {
    debugRequest('Info Request Received');
    _response2.default.success(res, {
      name: 'Simplex API',
      version: packageInfo.version
    });
  });
};