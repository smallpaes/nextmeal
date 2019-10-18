const { ensureAuthenticated, isAuthAdmin, getUser } = require('../config/auth')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Meal = db.Meal
const Order = db.Order
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

  app.get('/api/admin/restaurants', async (req, res) => {

    let restaurants = await Restaurant.findAll({
      include: [{
        model: Meal,
        include: [{
          model: Order, as: 'orders', attributes: ['id', 'order_status',]
        }],
        attributes: ['id']
      }]
    })
    restaurants = restaurants.map(restaurant => ({
      ...restaurant.dataValues,
      orderCount: restaurant.dataValues.Meals[0].dataValues.orders.length
    }))
    return res.json({ restaurants })
  })

  app.post('/api/owner', ensureAuthenticated, getUser, async (req, res) => {
    const restaurant = await Restaurant.create({ UserId: req.user.id, name: req.body.name })
    return res.status(200).json({ status: 'success', message: 'successfuly add a new restaurant' })
  })

  app.get('/api/owner', ensureAuthenticated, getUser, async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } })
    return res.status(200).json({ restaurant })
  })

  app.put('/api/owner', ensureAuthenticated, getUser, async (req, res) => {
    const restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } })
    await restaurant.update({ name: req.body.name })
    return res.status(200).json({ status: 'success', message: 'successfuly add a new restaurant' })
  })

  app.get('/api/owner/dishes', ensureAuthenticated, getUser, async (req, res) => {
    const meals = await Meal.findAll({ where: { RestaurantId: 1 } })
    return res.status(200).json({ meals })
  })
}