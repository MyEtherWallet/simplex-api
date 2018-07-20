'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _mangodb = require('./mangodb');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('index.js');
var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use((0, _cors2.default)());
(0, _routes2.default)(app);
(0, _mangodb.connect)().then(function () {
  logger.info('mangodb running on port: ' + _config.mangodb.host + ':' + _config.mangodb.port);
}).catch(function (err) {
  logger.error('mangodb error: ' + err);
});
var server = app.listen(_config.network.port, function () {
  logger.info('app running on port: ' + server.address().port);
});
exports.default = server;