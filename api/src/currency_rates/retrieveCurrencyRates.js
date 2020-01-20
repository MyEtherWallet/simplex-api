import {
  connect,
  findAndUpdate,
  // ExchangeRateSchema
} from '../mangodb';
// import eachOfSeries from 'async/eachOfSeries'
import createLogger from 'logging';
import {
  mangodb,
  simplex
} from '../config';
import request from 'request';
import debugLogger from 'debug';

// const recordLogger = createLogger('simplex_events/retrieveEvents.js : record-event')
const logger = createLogger('simplex_events/retrieveEvents.js');
const debugRequest = debugLogger('calls:Events');

connect().then(() => {
  logger.info(`mangodb running on port: ${mangodb.host}:${mangodb.port}`);
}).catch((err) => {
  logger.error(`mangodb error: ${err}`);
});

let getExchangeRates = () => {
  return new Promise((resolve, reject) => {
    const currencies = simplex.validFiat.join(',');
    const url = `http://data.fixer.io/api/latest?access_key=${simplex.currencyApiKey}&base=${simplex.baseCurrency}&symbols=${currencies}&format=1`;
    let options = {
      url: url,
      method: 'get',
      json: true
    };
    let retrieveCallback = (error, response, body) => {
      try {
        if (!error && response.statusCode === 200) {
          logger.error(body);
          const rates = Object.keys(body.rates);
          rates.map(cur => {
            return {base_currency: body.base, rate_currency: cur, rate: body.rates[cur]};
          });
          rates.forEach(updateItem);
          // processEvent
        } else if (response.statusCode === 400) {
          logger.error(response);
          reject(body);
        } else {
          logger.error(error);
          reject(error);
        }
      } catch (e) {
        logger.error(error);
        reject(error);
      }
    };
    debugRequest(options);
    request(options, retrieveCallback);
  });
};

function updateItem (recordItem, deleteCallback) {
  findAndUpdate(recordItem.rate_currency, {
    rate: recordItem.rate
  }).catch((err) => {
    logger.error(err);
  });
}

// function processEvent (item, key, callback) {
//   updateItem(item, callback)
//   // ExchangeRateSchema(item)
//   //   .save()
//   //   .then(() => {
//   //     updateItem(item, callback)
//   //   })
//   //   .catch((error) => {
//   //     recordLogger.error(error)
//   //     updateItem(item, callback)
//   //   })
// }

export default getExchangeRates;
