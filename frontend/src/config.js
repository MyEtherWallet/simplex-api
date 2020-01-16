let simplex = {
  validFiat: ['USD', 'EUR', 'GBP', 'RUB', 'AUD', 'KRW', 'CHF', 'CZK', 'DKK', 'NOK', 'NZD', 'PLN', 'SEK', 'TRY', 'ZAR', 'HUF'],
  validDigital: ['ETH'],
  minFiat: 50,
  maxFiat: 20000
}
let host = {
  url: process.env.API_HOST || 'http://172.20.0.2:8080'
}
let recaptcha = {
  siteKey: process.env.RECAPTCHA_SITE_KEY || ''
}
export {
  simplex,
  host,
  recaptcha
}
