
const handler = function (defaultValue = 42) {
  return {
    get: function (target, name) {
      return target.hasOwnProperty(name) ? target[name] : defaultValue;
    }
  };
};

export default {
  status: {
    invalidFiatAmount: true,
    invalidDigitalAmount: true,
    invalidAddress: true,
    invalidFiatAbove: false,
    invalidFiatBelow: false
  },
  orderInfo: {
    fiatCurrency: 'USD',
    digitalCurrency: 'ETH',
    requestedCurrency: 'ETH',
    fiatAmount: 0,
    fiatTotal: 0,
    digitalAmount: 1,
    digitalAddress: '',
    userId: '',
    linkQuery: {}
  },
  minFiat: new Proxy({USD: 50}, handler(50)),
  maxFiat: new Proxy({USD: 20000}, handler(20000))
};
