'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _quote = require('./quote');

var _quote2 = _interopRequireDefault(_quote);

var _order = require('./order');

var _order2 = _interopRequireDefault(_order);

var _info = require('./info');

var _info2 = _interopRequireDefault(_info);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    (0, _quote2.default)(app);
    (0, _order2.default)(app);
    (0, _info2.default)(app);
    (0, _status2.default)(app);
};