const mainRoute = require('./mainRoute')
const restRoute = require('./restRoute')
const adminRoute = require('./adminRoute')

module.exports = (app) => {
  app.use('/api', mainRoute)
  app.use('/api/restaurants', restRoute)
  app.use('/api/admin', adminRoute)
}