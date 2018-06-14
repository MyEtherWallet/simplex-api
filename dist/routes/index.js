'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _quote = require('./quote');

var _quote2 = _interopRequireDefault(_quote);

var _order = require('./order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    (0, _quote2.default)(app);
    (0, _order2.default)(app);
};