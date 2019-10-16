const { ensureAuthenticated, isAuthAdmin, getUser } = require('../config/auth')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
module.exports = (app) => {
  app.get('/api', (req, res) => {
    console.log(req.query);
    res.json({ data: 'Testing Data' })
  })
  app.get('/api/admin/users', ensureAuthenticated, getUser, isAuthAdmin, async (req, res) => {
    // const whereClause = {}
    // if (req.query.payment_status) {
    //   wherequery['payment_status'] = req.query.payment_status
    // }

    const users = await User.findAll()
    return res.json({ users })
  })
  app.get('/api/admin/users/:id', ensureAuthenticated, getUser, isAuthAdmin, async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
      return res.json({ name: user.name, location: user.location })
    } else {
      return res.status(400).json({ status: "error", message: "user not exist" })
    }
  })

  app.put('/api/admin/users/:id', ensureAuthenticated, getUser, isAuthAdmin, async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
      await user.update({ name: req.body.name })
      return res.json({ name: user.name, location: user.location })
    } else {
      return res.status(400).json({ status: "error", message: "user does not exist" })
    }
  })

  app.delete('/api/admin/users/:id', ensureAuthenticated, getUser, isAuthAdmin, async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
      await user.destroy()
      return res.json({ status: "success", message: "user deleted" })
    } else {
      return res.status(400).json({ status: "error", message: "fail to delete" })
    }
  })

  app.get('/api/admin/restaurants', ensureAuthenticated, getUser, isAuthAdmin, async (req, res) => {
    // const whereClause = {}
    // if (req.query.payment_status) {
    //   wherequery['payment_status'] = req.query.payment_status
    // }

    const restaurants = await Restaurant.findAll()
    return res.json({ restaurants })
  })
}