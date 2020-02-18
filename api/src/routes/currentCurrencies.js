import response from '../response';
import debugLogger from 'debug';
import {
  simplex
} from '../config';

const debugRequest = debugLogger('request:info');

export default (app) => {
  app.get('/current-currencies', (req, res) => {
    debugRequest('Current Currencies Request Received');
    const baseFiat = {
      USD: {
        symbol: 'USD',
        name: 'US Dollar'
      },
      EUR: {
        symbol: 'EUR',
        name: 'Euro'
      },
      CAD: {
        symbol: 'CAD',
        name: 'Canadian Dollar'
      },
      JPY: {
        symbol: 'JPY',
        name: 'Japanese Yen'
      }
    };
    const baseDigital = {
      BTC: {
        symbol: 'BTC',
        name: 'Bitcoin'
      },
      ETH: {
        symbol: 'ETH',
        name: 'Ether'
      }
    };

    const fiat = simplex.validFiat.reduce((acc, curr) => {
      if (baseFiat[curr]) {
        acc[curr] = baseFiat[curr];
      } else {
        acc[curr] = {
          symbol: curr,
          name: curr
        }
      }
      return acc;
    }, {});
    console.log(baseDigital); // todo remove dev item
    console.log(simplex.validDigital); // todo remove dev item
    const digital = simplex.validDigital.reduce((acc, curr) => {
      if (baseDigital[curr]) {
        acc[curr] = baseFiat[curr];
      } else {
        acc[curr] = {
          symbol: curr,
          name: curr
        }
      }
      return acc;
    }, {});

    console.log(digital); // todo remove dev item

    response.success(res, {
      fiat: fiat,
      digital: digital
    });

  });
}
