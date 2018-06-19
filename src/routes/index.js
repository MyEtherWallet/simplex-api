import quoteRoute from './quote'
import orderRoute from './order'
import infoRoute from './info'
export default (app) => {
    quoteRoute(app)
    orderRoute(app)
    infoRoute(app)
}