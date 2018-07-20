import response from '../response'
const packageInfo = require('../../package.json')

export default (app) => {
  app.get('/info', (req, res) => {
    response.success(res, {
      name: 'Simplex API',
      version: packageInfo.version
    })
  })
}
