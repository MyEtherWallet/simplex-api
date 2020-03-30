import quoteRoute from './quote'
import orderRoute from './order'
import infoRoute from './info'
import statusByQuoteRoute from './statusByQuote'
import statusRoute from './status'
import exchangeRates from './exchangeRates'
import currentCurrencies from './currentCurrencies'
export default (app) => {
  quoteRoute(app)
  orderRoute(app)
  infoRoute(app)
  statusByQuoteRoute(app)
  statusRoute(app)
  exchangeRates(app)
  currentCurrencies(app)
}
