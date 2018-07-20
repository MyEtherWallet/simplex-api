'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAndUpdate = exports.getOrderById = exports.Order = exports.connect = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

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
var getOrderById = function getOrderById(_userId) {
  return _schema2.default.find({
    user_id: _userId
  });
};
var findAndUpdate = function findAndUpdate(_userId, _newVals) {
  return _schema2.default.findOneAndUpdate({
    user_id: _userId
  }, _newVals);
};
exports.connect = connect;
exports.Order = _schema2.default;
exports.getOrderById = getOrderById;
exports.findAndUpdate = findAndUpdate;