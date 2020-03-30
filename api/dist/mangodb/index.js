'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAndUpdateStatus = exports.findAndUpdate = exports.getOrderById = exports.findAndUpdateExchangeRates = exports.getExchangeRates = exports.ExchangeRateSchema = exports.EventSchema = exports.Order = exports.connect = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _event_schema = require('./event_schema');

var _event_schema2 = _interopRequireDefault(_event_schema);

var _exchange_rate_schema = require('./exchange_rate_schema');

var _exchange_rate_schema2 = _interopRequireDefault(_exchange_rate_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connect = function connect() {
  return new Promise(function (resolve, reject) {
    _mongoose2.default.connect('mongodb://' + _config.mangodb.host + ':' + _config.mangodb.port + '/' + _config.mangodb.name);
    var db = _mongoose2.default.connection;
    db.once('error', function (error) {
      reject(error);
    });
    db.once('open', function () {
      resolve();
    });
  });
};

var getOrderById = function getOrderById(_userId, _quoteId) {
  return new Promise(function (resolve, reject) {
    if (_userId && _quoteId) {
      return _schema2.default.find({
        user_id: _userId,
        quote_id: _quoteId
      }).sort({ 'created_at': -1 }).exec(function (err, res) {
        if (err) reject(err);else resolve(res);
      });
    } else {
      return _schema2.default.find({
        user_id: _userId
      }).sort({ 'created_at': -1 }).exec(function (err, res) {
        if (err) reject(err);else resolve(res);
      });
    }
  });
};

var findAndUpdate = function findAndUpdate(_userId, _quoteId, _newVals) {
  if (_quoteId && _newVals) {
    return _schema2.default.findOneAndUpdate({
      user_id: _userId,
      quote_id: _quoteId
    }, _newVals);
  } else if (!_quoteId && _newVals) {
    return _schema2.default.findOneAndUpdate({
      user_id: _userId
    }, _newVals);
  } else {
    return _schema2.default.findOneAndUpdate({
      user_id: _userId
    }, _quoteId); // in this case _paymentId contains the content of _newVals
  }
};

var findAndUpdateStatus = function findAndUpdateStatus(_userId, _paymentId, _newVals) {
  return _schema2.default.findOneAndUpdate({
    user_id: _userId,
    payment_id: _paymentId
  }, _newVals);
};

var getExchangeRates = function getExchangeRates() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'USD';

  return _exchange_rate_schema2.default.find({
    base_currency: base
  });
};

var findAndUpdateExchangeRates = function findAndUpdateExchangeRates(queryItem, rateItem) {
  return _exchange_rate_schema2.default.findOneAndUpdate(queryItem, rateItem, { upsert: true });
};

exports.connect = connect;
exports.Order = _schema2.default;
exports.EventSchema = _event_schema2.default;
exports.ExchangeRateSchema = _exchange_rate_schema2.default;
exports.getExchangeRates = getExchangeRates;
exports.findAndUpdateExchangeRates = findAndUpdateExchangeRates;
exports.getOrderById = getOrderById;
exports.findAndUpdate = findAndUpdate;
exports.findAndUpdateStatus = findAndUpdateStatus;