import response from '../response'
import debugLogger from 'debug'
const packageInfo = require('../../package.json')

const debugRequest = debugLogger('request:info')

export default (app) => {
  app.get('/info', (req, res) => {
    debugRequest('Info Request Received')
    response.success(res, {
      name: 'Simplex API',
      version: packageInfo.version
    })
  })
}
