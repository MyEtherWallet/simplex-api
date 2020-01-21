import response from '../response';
import debugLogger from 'debug';
import {getExchangeRates} from '../mangodb';
import {
  simplex
} from '../config';
// const packageInfo = require('../../package.json')

const debugRequest = debugLogger('request:info');

export default (app) => {
  app.get('/exchange-rates', (req, res) => {
    debugRequest('Info Request Received');
    getExchangeRates(simplex.baseCurrency)
      .then(rates => {
        const cleanedRates = rates.map(item => {
          return {
            rate_currency: item.rate_currency,
            base_currency: item.base_currency,
            rate: item.rate,
            updatedAt: item.updatedAt
          }
        })
        response.success(res, {
          cleanedRates,
        });
      })
      .catch((error) => {
        // logger.error(error);
        // response.error(res, 'Failed to retrieve currency exchange rates')
        response.error(res, error);
      });

  });
}
