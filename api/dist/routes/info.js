'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var packageInfo = require('../../package.json');

exports.default = function (app) {
  app.get('/info', function (req, res) {
    _response2.default.success(res, {
      name: 'Simplex API',
      version: packageInfo.version
    });
  });
};