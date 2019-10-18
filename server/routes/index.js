const mainRoute = require('./mainRoute')
// const restRoute = require('./restRoute')
const ownerRoute = require('./ownerRoute')

module.exports = (app) => {
  app.use('/api', mainRoute)
  // app.use('/api/restaurants', restRoute)
  app.use('/api/owner', ownerRoute)
}