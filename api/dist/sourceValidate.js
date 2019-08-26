'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sourceyValidate;

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _config = require('./config');

var _expressRecaptcha = require('express-recaptcha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logging2.default)('sourceValidate.js');
var debug = (0, _debug2.default)('validation:bypass');

var recaptcha = new _expressRecaptcha.Recaptcha(_config.recaptcha.siteKey, _config.recaptcha.secretKey);

function sourceyValidate() {
  var validationOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _config.productValidation;

  return function (req, res, next) {
    if (req.headers['referer'] === validationOptions.referrerAppleiOS) {
      if (validationOptions.apiKeys.includes(req.headers[validationOptions.apiKeyHeaderName])) {
        req.recaptcha = {};
        req.mewSourceApplication = 'ios';
        debug('Mobile Bypass Success IOS');
        next();
      } else {
        logger.error('Invalid API key: IOS');
        _response2.default.error(res, 'Invalid API key');
      }
    } else if (req.headers['referer'] === validationOptions.referrerAndroid) {
      if (validationOptions.apiKeys.includes(req.headers[validationOptions.apiKeyHeaderName])) {
        req.recaptcha = {};
        req.mewSourceApplication = 'android';
        debug('Mobile Bypass Success Android');
        next();
      } else {
        logger.error('Invalid API key: Android');
        _response2.default.error(res, 'Invalid API key');
      }
    } else if (validationOptions.specialWebOrigins.includes(req.headers['origin'])) {
      req.recaptcha = {};
      req.mewSourceApplication = 'mew';
      debug('Web Bypass Success');
      next();
    } else if (/quote/.test(req.route.path)) {
      next();
    } else {
      return recaptcha.middleware.verify(req, res, next);
    }
  };
}