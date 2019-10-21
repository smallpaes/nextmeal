const helper = require('../_helpers')
const passport = require('./passport')

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (helper.ensureAuthenticated()) {
      return next()
    }
    return passport.authenticate('jwt', { session: false })(req, res, next)
  },
  getUser: (req, res, next) => {
    req.user = helper.getUser(req)
    next()
  },
  isAuthAdmin: (req, res, next) => {
    if (!req.user) return res.json({ status: 'error', message: 'Permission denied for users' })
    if (req.user.role !== 'Admin') return res.status(401).json({ status: 'error', message: 'Permission denied' })
    next()
  }
}