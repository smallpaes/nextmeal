const { ensureAuthenticated, isAuthAdmin, getUser, isAuthOwner } = require('../config/auth')
const mainRoute = require('./mainRoute')
const restRoute = require('./restRoute')
const userRoute = require('./userRoute')
const locationRoute = require('./locationRoute')
const ownerRoute = require('./ownerRoute')
const adminRoute = require('./adminRoute')
const orderRoute = require('./orderRoute')

module.exports = (app) => {
  app.use('/api', mainRoute)
  app.use('/api/restaurants', restRoute)
  app.use('/api/users', userRoute)
  app.use('/api/location', locationRoute)
  app.use('/api/admin', ensureAuthenticated, getUser, isAuthAdmin, adminRoute)
  app.use('/api/owner', ensureAuthenticated, getUser, isAuthOwner, ownerRoute)
  app.use('/api/order', ensureAuthenticated, getUser, orderRoute)
}