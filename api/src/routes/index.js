import quoteRoute from './quote'
import orderRoute from './order'
import infoRoute from './info'
import statusRoute from './status'
export default (app) => {
  quoteRoute(app)
  orderRoute(app)
  infoRoute(app)
  statusRoute(app)
}
