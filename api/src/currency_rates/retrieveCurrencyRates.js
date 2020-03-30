import {
  connect,
  findAndUpdateExchangeRates
} from '../mangodb'
import createLogger from 'logging'
import {
  mangodb,
  simplex
} from '../config'
import request from 'request'
import debugLogger from 'debug'
import BigNumber from 'bignumber.js'

const logger = createLogger('currency_rates/retrieveCurrencyRates.js')
const debugRequest = debugLogger('calls:Events')

connect().then(() => {
  logger.info(`mangodb running on port: ${mangodb.host}:${mangodb.port}`)
}).catch((err) => {
  logger.error(`mangodb error: ${err}`)
})

const multiply = (val1, val2) => {
  return new BigNumber(val1).times(new BigNumber(val2)).toNumber()
}

let getExchangeRates = () => {
  return new Promise((resolve, reject) => {
    const currencies = simplex.validFiat.join(',')
    const url = `http://data.fixer.io/api/latest?access_key=${simplex.currencyApiKey}&base=${simplex.baseCurrency}&symbols=${currencies}&format=1`
    let options = {
      url: url,
      method: 'get',
      json: true
    }
    let retrieveCallback = (error, response, body) => {
      try {
        if (!error && response.statusCode === 200) {
          logger.error(body)
          const rates = Object.keys(body.rates).reduce((prior, current) => {
            prior.push({
              pair_key: body.base + current,
              base_currency: body.base,
              rate_currency: current,
              min: multiply(simplex.minBaseCurrency, body.rates[current]),
              max: multiply(simplex.maxBaseCurrency, body.rates[current]),
              rate: body.rates[current]
            })
            return prior
          }, [])
          rates.forEach(updateItem)
          // processEvent
        } else if (response.statusCode === 400) {
          logger.error(response)
          reject(body)
        } else {
          logger.error(error)
          reject(error)
        }
      } catch (e) {
        logger.error(error)
        reject(error)
      }
    }
    debugRequest(options)
    request(options, retrieveCallback)
  })
}

function updateItem (recordItem) {
  findAndUpdateExchangeRates({
    pair_key: recordItem.pair_key
  }, recordItem).catch((err) => {
    logger.error(err)
  })
}

export default getExchangeRates
