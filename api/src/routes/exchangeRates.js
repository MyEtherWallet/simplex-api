import response from '../response'
import debugLogger from 'debug'
import {getExchangeRates} from '../mangodb'
import {
  simplex
} from '../config'

const debugRequest = debugLogger('request:info')

export default (app) => {
  app.get('/exchange-rates', (req, res) => {
    debugRequest('Exchange Rates Request Received')
    getExchangeRates(simplex.baseCurrency)
      .then(rates => {
        const cleanedRates = rates.map(item => {
          return {
            rate_currency: item.rate_currency,
            base_currency: item.base_currency,
            min: item.min,
            max: item.max,
            rate: item.rate,
            updatedAt: item.updatedAt
          }
        })
        response.success(res, {
          rates: cleanedRates
        })
      })
      .catch((error) => {
        response.error(res, error)
      })
  })
}
