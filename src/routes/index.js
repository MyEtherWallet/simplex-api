import quoteRoute from './quote'
import orderRoute from './order'
export default (app) => {
    quoteRoute(app)
    orderRoute(app)
}