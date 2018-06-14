import express from 'express'
import bodyParser from 'body-parser'
import createLogger from 'logging'
import cors from 'cors'
import routes from './routes'
import {network} from './config'
const logger = createLogger('index.js')
let app = express()

app.use(bodyParser.json())
app.use(cors())
routes(app)

let server = app.listen(network.port, () => {
    logger.info(`app running on port: ${server.address().port}`)
})