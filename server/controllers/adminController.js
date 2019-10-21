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
const User = db.User
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')
const { validationResult } = require('express-validator');
const Promise = require('bluebird')
// const pageLimit = 10

let adminController = {
  getRestaurants: async (req, res) => {
    try {
      // let page = (Number(req.query.page) < 1 || req.query.page === undefined) ? 1 : Number(req.query.page)
      let whereQuery = {}
      if (req.query.category) {
        whereQuery['CategoryId'] = req.query.category
      }
      let restaurants = await Restaurant.findAll({
        where: {
          name: { [Op.substring]: req.query.name || '' },
          CategoryId: { [Op.substring]: req.query.category || '' }
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
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        orderCount: (restaurant.dataValues.Meals[0]) ? restaurant.dataValues.Meals[0].orders.length : 0
      }))
      restaurants.sort((a, b) => (a.orderCount < b.orderCount) ? 1 : -1)
      res.status(202).json({ status: 'success', restaurants, message: 'Successfully get restautants' })
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
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ status: 'error', errors: errors.array(), message: 'restautant information should be filled' });
      }
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
        include: [{model: Subscription}],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Orders WHERE Orders.UserId = User.id)'), 'orderCount'],
          ],
          exclude: ['password']
        },
        order: [[{model: Subscription}, 'createdAt', 'DESC']],  
      })
      // let users = await db.sequelize.query("SELECT * FROM Users", { type: sequelize.QueryTypes.SELECT}).then(users => {
      //   return Promise.map(users, (user) => {
      //     // console.log(u)
      //     return db.sequelize.query("SELECT * FROM Subscriptions WHERE Subscriptions.UserId =" + user.id + " LIMIT = 1 ORDER BY createdAt DESC")
      //   })
      // })

      res.status(200).json({ status: 'success', users, message: 'Admin get users info.' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  deleteUser: async (req, res) => {
    try {

    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = adminController