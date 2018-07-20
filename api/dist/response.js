'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  error: function error(res, msg) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: true,
      result: msg
    }, null, 3));
  },
  success: function success(res, msg) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: false,
      result: msg
    }, null, 3));
  }
};