import response from '../response'
import debugLogger from 'debug'
import {getExchangeRates} from '../mangodb';
import {
  simplex
} from '../config'
// const packageInfo = require('../../package.json')

const debugRequest = debugLogger('request:info')

export default (app) => {
  app.get('/exchange-rates', (req, res) => {
    debugRequest('Info Request Received')
    getExchangeRates(simplex.baseCurrency)
      .then(rates =>{
        response.success(res, {
          rates,
        })
      })
      .catch((error) => {
        logger.error(error);
        response.error(res, 'Failed to retrieve currency exchange rates')
      })

  })
}
