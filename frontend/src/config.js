let simplex = {
  validFiat: ['EUR', 'USD'],
  validDigital: ['BTC', 'ETH'],
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
