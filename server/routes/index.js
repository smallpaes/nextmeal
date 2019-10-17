const mainRoute = require('./mainRoute')
const restRoute = require('./restRoute')

module.exports = (app) => {
  app.use('/api', mainRoute)
  app.use('/api/restaurants', restRoute)
}