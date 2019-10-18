const { ensureAuthenticated, isAuthAdmin, getUser } = require('../config/auth')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Meal = db.Meal
const Order = db.Order
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

  app.post('/signup', async (req, res) => {
    // check for empty input
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: 'All fields are required' })
    }
    // check if password length is between 8-12
    if (req.body.password.length < 8 || req.body.password.length > 12) {
      return res.json({ status: 'error', message: 'Password should be between 8-12' })
    }
    // validate password
    // if (req.body.password !== req.body.passwordCheck) {
    //   return res.json({ status: 'error', message: 'Two passwords do not match' })
    // }

    try {
      // check if it's a unique user name and email
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email: req.body.email },
            { name: req.body.name }
          ]
        }
      })

      if (user) {
        return res.json({ status: 'error', message: 'Existing email or user name' })
      }

      // create user
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        role: 'Admin'
      })
      return res.json({ status: 'success', message: 'Successfully sign up' })
    } catch (error) {
      res.json({ status: 'error', message: error })
    }
  }),
    app.post('/signin', async (req, res) => {
      // check for empty field
      if (!req.body.email || !req.body.password) {
        return res.json({ status: 'error', message: 'Email and password are required' })
      }
      // check if user exists and password is correct
      const { email: userName, password: password } = req.body
      const user = await User.findOne({ where: { email: userName } })
      if (!user) return res.status(401).json({ status: 'error', message: 'User does not exist' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      // generate and provide user with a token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'TaoMikeDannyAwesomeTwitterProject')
      return res.json({
        status: 'success', message: 'Successfully log in', token, user: {
          id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar
        }
      })
    })
}