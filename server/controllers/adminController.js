const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const sequelize = require('sequelize')
const moment = require('moment')
const Op = sequelize.Op
const Subscription = db.Subscription
const Restaurant = db.Restaurant
const Comment = db.Comment
const Order = db.Order
const Meal = db.Meal
const User = db.User
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')
const { validMessage } = require('../middleware/middleware')
const pageLimit = 10
const districts = require('../location/district.json')


let adminController = {
  getRestaurants: async (req, res) => {
    try {
      const { name, category, dist } = req.query
      // let page = (Number(req.query.page) < 1 || req.query.page === undefined) ? 1 : Number(req.query.page)
      let restaurants = await Restaurant.findAll({
        where: {
          name: { [Op.substring]: name || '' },
          CategoryId: category ? { [Op.eq]: category } : { [Op.gt]: 0 },
          location: { [Op.substring]: dist || '' }
        },
        include: [
          { model: Comment, attributes: ['id', 'user_text', 'res_text', 'rating', 'image', 'createdAt'] },
          {
            model: Meal,
            include: [{
              model: Order,
              as: 'orders',
              where: { order_status: '今日' },
            }],
          }
        ],
        attributes: [
          'id', 'name', 'rating', 'location',
          [sequelize.literal(customQuery.Comment.RestaurantId), 'commentCount'],
        ],
        // offset: (page - 1) * pageLimit,
        // limit: pageLimit,
        // subQuery: false

      })

      restaurants.sort((a, b) => (a.orderCount < b.orderCount) ? 1 : -1)
      res.status(200).json({ status: 'success', restaurants, districts, message: 'Successfully get restautants' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },
  // admin 看單一餐廳資訊
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.restaurant_id)
      if (restaurant) {
        return res.status(200).json({ status: 'success', restaurant, message: 'Successfully get restautant' })
      }
      return res.status(400).json({ status: 'error', message: 'restaurant does not exist' })
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
            lat: req.body.lat,
            lng: req.body.lng
          })
          return res.status(200).json({
            status: 'success',
            message: 'Successfully update restaurant information with image.'
          })
        })
      } else {
        await restaurant.update({ ...req.body })
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
      if (!restaurant) return res.status(400).json({ status: 'error', message: 'restaurant does not exist' })
      await restaurant.destroy()
      return res.status(200).json({ status: 'success', message: 'restaurant was successfully destroyed' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getUsers: async (req, res) => {
    try {
      const { name, subscription_status } = req.query
      let time = moment().format('YYYY-MM-DD')
      let whereQuery = {}
      // 邏輯有瑕疵，尚無法篩選還有兩天以上，但訂單餘額已經為 0 的人為無效訂單。
      if (subscription_status) {
        if (subscription_status === 'inactive') {
          whereQuery = { sub_expired_date: { [Op.lt]: time } }
        } else {
          whereQuery = { sub_description: true, sub_expired_date: { [Op.gte]: time } }
        }
      }

      let users = await User.findAll({
        where: { name: { [Op.substring]: name || '' } },
        include: [{
          model: Subscription,
          where: whereQuery
        }],
        attributes: {
          include: [
            [sequelize.literal(customQuery.Order.UserId), 'order_num'],
          ],
          exclude: [
            'password', 'prefer', 'dob', 'modifiedAt', 'location',
            'address', 'lat', 'lng', 'createdAt', 'updatedAt'
          ]
        },
        order: [[{ model: Subscription }, 'createdAt', 'DESC']]
      })
      users = users.map(user => ({
        ...user.dataValues,
        sub_description: (user.dataValues.Subscriptions[0]) ?
          user.dataValues.Subscriptions[0].dataValues.sub_description : false,
        subscription_status: (user.dataValues.Subscriptions[0]) ? (
          user.dataValues.Subscriptions[0].dataValues.payment_status === true &&
          user.dataValues.Subscriptions[0].dataValues.sub_expired_date > Date.now()) ? 'active' : 'inactive'
          : 'inactive'
      }))
      return res.status(200).json({ status: 'success', users, message: 'Admin get users info.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  getUser: async (req, res) => {
    try {
      let user = await User.findByPk(req.params.user_id, {
        attributes: [
          'id', 'name', 'email', 'role', 'avatar',
          'prefer', 'dob', 'modifiedAt', 'location',
          'address', 'lat', 'lng'
        ]
      })
      if (!user) return req.status(400).json({ status: 'error', user, message: 'user does not exist' })
      return res.status(200).json({ status: 'success', user, message: 'Successfully get the user information.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  deleteUser: async (req, res) => {
    try {
      let user = await User.findByPk(req.params.user_id)
      if (!user) return res.status(400).json({ status: 'error', message: 'user is not exist or you are not able to do this action.' })
      await user.destroy()
      return res.status(200).json({ status: 'success', message: 'Successfully delete this user.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrders: async (req, res) => {
    try {
      const { page, order_id, order_status, date } = req.query
      let start = moment.utc(date).startOf('day').toDate()
      let end = moment.utc(date).endOf('day').toDate()
      // 如果 order_status 不是取消，就顯示非取消的 order, 預設為當日非取消的 order 
      let whereQuery = {
        order_status: { [Op.notLike]: '取消' },
        require_date: { [Op.gte]: start, [Op.lte]: end }
      }
      if (order_id) {
        whereQuery['id'] = { [Op.eq]: order_id }
      }
      if (order_status && order_status === '取消') {
        whereQuery['order_status'] = { [Op.substring]: '取消' || '' }
      }
      let pageNum = (Number(page) < 1 || page === undefined) ? 1 : Number(page)
      let orders = await Order.findAndCountAll({
        where: whereQuery,
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          {
            model: Meal, as: 'meals', attributes: ['id', 'name', 'image'],
            include: [{ model: Restaurant, attributes: ['id', 'name', 'image'] }]
          }
        ],
        attributes: [
          'id', 'require_date', 'order_status', 'updatedAt',
          customQuery.char.date,
          customQuery.char.time
        ],
        order: [['require_date', 'ASC']],
        offset: (pageNum - 1) * pageLimit,
        limit: pageLimit,
      })
      if (orders.rows.length < 1) return res.status(400).json({ status: 'error', orders, message: 'can not find any orders' })
      const count = orders.count
      orders = orders.rows.map(order => ({
        ...order.dataValues,
        meals: order.dataValues.meals[0]
      }))
      let pages = Math.ceil((count) / pageLimit)
      res.status(200).json({ status: 'success', orders, pages, message: 'Successfully get Orders.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },
  // admin 的取消路由
  putCancel: async (req, res) => {
    try {
      let order = await Order.findByPk(req.params.order_id, {
        include: [{ model: Meal, as: 'meals' }]
      })
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist' })

      let start = moment().startOf('day').toDate()
      let subscription = await Subscription.findOne({
        where: {
          UserId: order.UserId,
          payment_status: true,
          sub_expired_date: { [Op.gte]: start }
        },
        order: [['sub_expired_date', 'DESC']],
        limit: 1
      })
      let returnNum = subscription.sub_balance + order.amount
      if (order.order_status === '取消') return res.status(400).json({ status: 'error', message: 'order status had already cancel.' })
      await subscription.update({
        sub_balance: returnNum
      })
      order = await order.update({
        order_status: '取消'
      })
      let meal = await Meal.findByPk(order.meals[0].dataValues.id)
      await meal.update({
        quantity: meal.quantity + order.amount
      })
      return res.status(200).json({ status: 'success', subscription, message: 'Successfully cancel the order.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = adminController