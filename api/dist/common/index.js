'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getIP = function getIP(req) {
  return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(',')[0];
};

exports.getIP = getIP;