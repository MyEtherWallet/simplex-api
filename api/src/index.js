import express from 'express'
import bodyParser from 'body-parser'
import createLogger from 'logging'
import cors from 'cors'
import routes from './routes'
import {
  connect as dbConnect
} from './mangodb'
import {
  network,
  mangodb
} from './config'

const logger = createLogger('index.js')
let app = express()

app.use(bodyParser.json())
app.use(cors())
routes(app)
dbConnect().then(() => {
  logger.info(`mangodb running on port: ${mangodb.host}:${mangodb.port}`)
}).catch((err) => {
  logger.error(`mangodb error: ${err}`)
})
let server = app.listen(network.port, () => {
  logger.info(`app running on port: ${server.address().port}`)
})
export default server
