const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const sequelize = require('sequelize')
const Op = sequelize.Op
const Subscription = db.Subscription

const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const Order = db.Order
const Meal = db.Meal
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')
const { validMessage } = require('../middleware/middleware')
// const pageLimit = 10
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')
const districts = require('../location/district.json')


let adminController = {
  getRestaurants: async (req, res) => {
    try {
      const { name, category, location } = req.query
      // let page = (Number(req.query.page) < 1 || req.query.page === undefined) ? 1 : Number(req.query.page)
      let restaurants = await Restaurant.findAll({
        where: {
          name: { [Op.substring]: name || '' },
          CategoryId: { [Op.substring]: category || '' },
          location: { [Op.substring]: location || '' }
        },
        include: [
          { model: Category, attributes: ['name'] },
          { model: Comment, attributes: ['id', 'user_text', 'res_text', 'rating', 'image', 'createdAt'] },
          {
            model: Meal,
            include: [{
              model: Order,
              as: 'orders',
              where: { order_status: '已領取' },
            }],
          }
        ],
        attributes: [
          'id', 'name', 'rating',
          [sequelize.literal(customQuery.Comment.RestaurantId), 'commentCount'],
        ],
        // offset: (page - 1) * pageLimit,
        // limit: pageLimit,
        // subQuery: false

      })
      const categories = await Category.findAll()
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        orderCount: (restaurant.dataValues.Meals[0]) ? restaurant.dataValues.Meals[0].orders.length : 0
      }))

      restaurants.sort((a, b) => (a.orderCount < b.orderCount) ? 1 : -1)
      res.status(202).json({ status: 'success', restaurants, districts, categories, message: 'Successfully get restautants' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },
  // admin 看單一餐廳資訊
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.restaurant_id)
      if (restaurant) {
        return res.status(202).json({ status: 'success', restaurant, message: 'Successfully get restautant' })
      }
      return res.status(202).json({ status: 'success', message: 'Restautant is not exist.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },
  // admin 修改餐廳資訊
  putRestaurant: async (req, res) => {
    try {
      validMessage(req, res)
      let restaurant = await Restaurant.findByPk(req.params.restaurant_id)
      if (!restaurant) {
        return res.status(400).json({ status: 'error', message: 'The restaurant is not exist.' })
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await restaurant.update({
            name: req.body.name,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image,
            tel: req.body.tel,
            address: req.body.address,
            opening_hour: req.body.opening_hour,
            closing_hour: req.body.closing_hour,
            latitude: req.body.lat,
            longitude: req.body.lng
          })
          return res.status(200).json({
            status: 'success',
            message: 'Successfully update restaurant information with image.'
          })
        })
      } else {
        await restaurant.update(req.body)
        return res.status(200).json({
          status: 'success',
          message: 'Successfully update restaurant information.'
        })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  deleteRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.restaurant_id)
      if (!restaurant) return res.status(400).json({ status: 'error', message: 'restaurant is not exist' })
      await restaurant.destroy()
      return res.status(202).json({ status: 'success', message: 'restaurant was successfully destroyed' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [{ model: Subscription }],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Orders WHERE Orders.UserId = User.id)'), 'orderCount'],
          ],
          exclude: [
            'password', 'prefer', 'dob', 'modifiedAt', 'location',
            'address', 'latitude', 'longitude', 'createdAt', 'updatedAt'
          ]
        },
        order: [[{ model: Subscription }, 'createdAt', 'DESC']],
      })
      users = users.map(user => ({
        ...user.dataValues,
        sub_description: (user.dataValues.Subscriptions[0]) ? (
          user.dataValues.Subscriptions[0].dataValues.payment_status === '1' &&
          user.dataValues.Subscriptions[0].dataValues.sub_expired_date > Date.now()
        ) ? user.dataValues.Subscriptions[0].dataValues.sub_description : false
          : false,
        subscription_status: (user.dataValues.Subscriptions[0]) ? (
          user.dataValues.Subscriptions[0].dataValues.payment_status === '1' &&
          user.dataValues.Subscriptions[0].dataValues.sub_expired_date > Date.now()) ? true : false
          : false
      }))
      res.status(200).json({ status: 'success', users, message: 'Admin get users info.' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  getUser: async (req, res) => {
    try {
      // if (req.user.role !== 'Admin') return res.status(400).json({ status: 'error', message: 'user is not exist or you are not able to do this action.' })
      let user = await User.findByPk(req.params.user_id, {
        attributes: [
          'id', 'name', 'email', 'role', 'avatar',
          'prefer', 'dob', 'modifiedAt', 'location',
          'address', ['latitude', 'lat'], ['longitude', 'lng']
        ]
      })

      res.status(200).json({ status: 'success', user, message: 'Successfully get the user information.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },

  deleteUser: async (req, res) => {
    try {
      let user = await User.findByPk(req.params.user_id)
      if (!user) return res.status(400).json({ status: 'error', message: 'user is not exist or you are not able to do this action.' })
      await user.destroy()
      res.status(200).json({ status: 'success', message: 'Successfully delete this user.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrders: async (req, res) => {
    try {
      const { page, order_id, order_status, email } = req.query
      let pageNum = (Number(page) < 1 || page === undefined) ? 1 : Number(page)
      let orders = await Order.findAll({
        where: {
          id: { [Op.substring]: order_id || '' },
          order_status: { [Op.substring]: order_status || '' }
        },
        include: [
          {
            model: User,
            where: { email: { [Op.substring]: email || '' } },
            attributes: ['id', 'name', 'email']
          },
          {
            model: Meal, as: 'meals', attributes: ['id', 'name', 'image'],
            include: [{ model: Restaurant, attributes: ['id', 'name', 'image'] }]
          }
        ],
        attributes: [
          'id', 'require_date', 'order_status', 'updatedAt',
          [sequelize.fn('date_format', sequelize.col('require_date'), '%Y%c%d'), 'date'],
          [sequelize.fn('date_format', sequelize.col('require_date'), '%H:%i'), 'time']
        ],
        offset: (pageNum - 1) * pageLimit,
        limit: pageLimit,
      })
      orders = orders.map(order => ({
        ...order.dataValues,
        meals: order.dataValues.meals[0].dataValues
      }))
      res.status(200).json({ status: 'success', orders, message: 'Successfully get Orders.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = adminController