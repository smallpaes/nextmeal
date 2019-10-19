const mainRoute = require('./mainRoute')
const restRoute = require('./restRoute')
const userRoute = require('./userRoute')

module.exports = (app) => {
  app.use('/api', mainRoute)
  app.use('/api/restaurants', restRoute)
  app.use('/api/user', userRoute)
}