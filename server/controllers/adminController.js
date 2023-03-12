const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const sequelize = require('sequelize')
const moment = require('moment')
const Op = sequelize.Op
const Subscription = db.Subscription
const Restaurant = db.Restaurant
const Comment = db.Comment
const Category = db.Category
const Order = db.Order
const Meal = db.Meal
const User = db.User
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')
const pageLimit = 10
const districts = require('../location/district.json')
const { findOrder, sendEmail } = require('../middleware/middleware')

let adminController = {
  getRestaurants: async (req, res) => {
    try {
      const { name, category, dist, page } = req.query
      let pageNum = (Number(page) < 1 || page === undefined) ? 1 : Number(page)
      let restaurants = await Restaurant.findAndCountAll({
        where: {
          ...(name && { name: process.env.heroku ? { [Op.any]: `%${name}%` } : { [Op.substring]: name } }),
          CategoryId: category ? { [Op.eq]: category } : { [Op.gt]: 0 },
          location: { [Op.substring]: dist || '' }
        },
        include: [Comment, Meal],
        attributes: [
          'id', 'name', 'rating', 'location',
          [sequelize.literal(customQuery.Comment.RestaurantId), 'commentCount']
        ],
        order: [['rating', 'DESC'], ['id', 'DESC']],
        offset: (pageNum - 1) * pageLimit,
        limit: pageLimit,
        distinct: true
      })
      const count = restaurants.count
      let pages = Math.ceil((count) / pageLimit)
      return res.status(200).json({
        status: 'success',
        restaurants: { pages: pages, restaurants: await findOrder(restaurants) },
        districts, message: 'Successfully get restautants'
      })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },
  // admin 看單一餐廳資訊
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.restaurant_id, {
        include: [Category]
      })
      if (!restaurant) {
        return res.status(400).json({ status: 'error', message: 'restaurant does not exist' })
      }
      const categories = await Category.findAll()
      return res.status(200).json({ status: 'success', restaurant, categories, message: 'Successfully get restaurant' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  // admin 修改餐廳資訊
  putRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.restaurant_id)
      if (!restaurant) {
        return res.status(400).json({ status: 'error', message: 'The restaurant does not exist.' })
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
      console.log(error.message)
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
      const { page, name, sub_status } = req.query
      const start = moment().startOf('day').toDate()
      let pageNum = (Number(page) < 1 || page === undefined) ? 1 : Number(page)
      //if it runs on heroku,use any to fix case sensitive issue
      let whereQuery = {}
      if (name) {
        whereQuery.name = process.env.heroku ? { [Op.any]: `%${name}%` || '' } : { [Op.substring]: name || '' };
      }
      if (sub_status === 'inactive') {
        whereQuery['expired_date'] = {
          [Op.or]: {
            [Op.lt]: start,
            [Op.eq]: null
          }
        }
      };
      if (sub_status === 'active') {
        whereQuery['expired_date'] = {
          [Op.or]: {
            [Op.gte]: start
          }
        };
      };

      let users = await User.findAndCountAll({
        where: whereQuery,
        include: [{
          model: Subscription
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
        order: [['expired_date', 'DESC'], ['id', 'ASC']],
        offset: (pageNum - 1) * pageLimit,
        limit: pageLimit,
        subQuery: false,
        districts: true
      })
      let pages = Math.ceil((users.count) / pageLimit)
      users = users.rows.map(user => ({
        ...user.dataValues,
        sub_description: (user.Subscriptions[0]) ? user.Subscriptions[0].sub_description : false,
        sub_status: (user.expired_date) ? (user.expired_date >= start) ? 'active' : 'inactive' : 'inactive'
      }))
      return res.status(200).json({ status: 'success', users, pages, message: 'Admin get users info.' })
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
      const roles = [
        {
          id: 1,
          name: 'Admin'
        },
        {
          id: 2,
          name: 'Owner'
        },
        {
          id: 3,
          name: 'User'
        }
      ]
      const categories = await Category.findAll({ attributes: ['id', 'name'] })
      if (!user) return res.status(400).json({ status: 'error', user, message: 'user does not exist' })
      return res.status(200).json({ status: 'success', user, roles, categories, message: 'Successfully get the user information.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  deleteUser: async (req, res) => {
    try {
      let user = await User.findByPk(req.params.user_id)
      if (!user) return res.status(400).json({ status: 'success', message: 'user is not exist' })
      if (user.role === 'Admin' || req.user.id === user.id) {
        return res.status(200).json({ status: 'success', message: 'you are not allow to do this action' })
      }
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
        require_date: { [Op.gte]: start, [Op.lte]: end }
      }
      if (order_id) {
        whereQuery['id'] = { [Op.eq]: order_id }
      }
      if (order_status && order_status === '取消') {
        whereQuery['order_status'] = { [Op.substring]: '取消' || '' }
      }
      if (order_status && order_status === '未取消') {
        whereQuery['order_status'] = { [Op.notLike]: '取消' }
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
        order: [['require_date', 'ASC'], ['id', 'ASC']],
        offset: (pageNum - 1) * pageLimit,
        limit: pageLimit,
      })
      if (orders.rows.length < 1) {
        orders = []
        return res.status(200).json({ status: 'success', orders, message: 'can not find any order' })
      }
      const count = orders.count
      orders = orders.rows.map(order => ({
        ...order.dataValues,
        meals: order.dataValues.meals[0]
      }))
      let pages = Math.ceil((count) / pageLimit)
      return res.status(200).json({ status: 'success', orders, pages, message: 'Successfully get Orders.' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  // admin 的取消路由
  putCancel: async (req, res) => {
    try {
      let order = await Order.findByPk(req.params.order_id, {
        include: [
          User,
          { model: Meal, as: 'meals' }
        ]
      })
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist' })
      let meal = await Meal.findByPk(order.meals[0].id, {
        include: [Restaurant]
      })
      if (!meal) return res.status(400).json({ status: 'error', message: 'meal does not exist.' })
      if (order.order_status === '取消') {
        return res.status(400).json({ status: 'error', message: 'order status had already cancel.' })
      }
      if (order.meals.length === 0 || order.meals[0] === undefined) {
        return res.status(400).json({ status: 'error', message: 'information is not correct' })
      }
      let start = moment().startOf('day').toDate()
      let subscription = await Subscription.findOne({
        where: {
          UserId: Number(order.UserId),
          payment_status: true,
          sub_expired_date: { [Op.gte]: start }
        },
        order: [['sub_expired_date', 'DESC']]
      })
      let returnNum = subscription.sub_balance + order.amount
      subscription = await subscription.update({
        sub_balance: returnNum
      })
      order = await order.update({
        order_status: '取消'
      })
      await meal.update({
        quantity: meal.quantity + order.amount
      })
      const emailInfo = {
        email: order.User.email,
        template: 'orderInfo',
        subject: '【Nextmeal】訂購餐點已取消',
        cancel: true,
        order: {
          ...order.dataValues,
          order_date: moment(order.order_date).format('YYYY-MM-DD HH:mm'),
          require_date: moment(order.require_date).format('YYYY-MM-DD HH:mm'),
        },
        meal,
        subscription
      }
      sendEmail(req, res, emailInfo)
      return res.status(200).json({ status: 'success', subscription, message: 'Successfully cancel the order.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },
  dashboard: async (req, res) => {
    try {
      const now = moment().toISOString()
      const start = moment().startOf('day').toISOString()
      const end = moment().endOf('day').toISOString()

      // 取得一個月前的時間做為區間起點
      const pass_one_month = moment().subtract(1, 'months').toDate()

      // get all user relative counts
      let users = await User.findAll({
        attributes: [
          customQuery.literal.subscribeUsers(now),
          customQuery.literal.nonsubscribeUsers(now),
          customQuery.literal.userIncreased(end, start)
        ]
      })

      const userIncreased = users[0].dataValues.userIncreased

      // get all restaurant relative counts (for a month period)
      let restaurants = await Restaurant.findAll({
        where: {
          createdAt: {
            [Op.gte]: pass_one_month
          }
        },
        attributes: [
          customQuery.char.date_for_admin_dashboard,
          [sequelize.literal(`COUNT(*)`), 'count'],
          customQuery.literal.restIncreased(end, start),
          customQuery.literal.subtIncreased(end, start)
        ],
        group: ['date']
      })
      const total_restaurants = await Restaurant.count()
      const restIncreased = restaurants[0].dataValues.restIncreased
      const subtIncreased = restaurants[0].dataValues.subtIncreased

      // count orders overall
      const total_orders = await Order.count()

      // query order for the past one month
      let orders = await Order.findAll({
        where: {
          require_date: {
            [Op.gte]: pass_one_month
          }
        },
        attributes: [
          customQuery.literal.todayOrders(start, end),
          customQuery.char.date_for_dashboard,
          [sequelize.literal(`COUNT(*)`), 'count']
        ],
        group: ['date']
      })
      // get todays order counts
      const order_num = orders[0].dataValues.todayOrders


      // find all dates a month from now
      var dateArray = [];
      let light_package = []
      let heavy_package = []
      var currentDate = moment(pass_one_month).endOf('day').toDate();
      var stopDate = moment().endOf('day').toDate();
      while (currentDate <= stopDate) {
        let light_subs = await Subscription.count({
          where: {
            sub_date: {
              [Op.lt]: currentDate
            },
            sub_name: {
              [Op.eq]: '輕量型'
            },
            payment_status: true
          }
        })
        light_package.push(light_subs)
        let heavy_subs = await Subscription.count({
          where: {
            sub_date: {
              [Op.lt]: currentDate
            },
            sub_name: {
              [Op.eq]: '滿足型'
            },
            payment_status: true
          }
        })
        heavy_package.push(heavy_subs)

        dateArray.push(moment(currentDate).format('MM/DD'))
        currentDate = moment(currentDate).add(1, 'days')
      };

      // check if there's missing dates
      const currentDates = orders.map(item => item.dataValues.date)
      const restDates = restaurants.map(item => item.dataValues.date)
      const missing_fields_orders = dateArray.filter(v => currentDates.indexOf(v) === -1)
      const missing_fields_restaurants = dateArray.filter(v => restDates.indexOf(v) === -1)

      // create the an end result object for later sorting
      const order_result = orders.map(item => ({
        date: item.dataValues.date,
        count: item.dataValues.count
      }))

      const rest_result = restaurants.map(item => ({
        date: item.dataValues.date,
        count: item.dataValues.count
      }))

      // if missing fields exist,fill in with value 0
      missing_fields_orders.map(async item => {
        await order_result.push({ "date": item, count: 0 })
      })

      missing_fields_restaurants.map(async item => {
        await rest_result.push({ "date": item, count: 0 })
      })
      // sort the result 
      order_result.sort((a, b) => { return new Date(a["date"]) - new Date(b["date"]) })
      rest_result.sort((a, b) => { return new Date(a["date"]) - new Date(b["date"]) })

      // adjust order data format for front-end
      orders = {
        labels: dateArray,
        data: order_result.map(item => item.count),
        tableName: '訂單',
        total: total_orders,
        thisMonth: Object.values(order_result).reduce((total, current) => total + Number(current.count), 0)
      }

      // adjust restaurant data format for front-end
      restaurants = {
        labels: dateArray,
        data: rest_result.map(item => item.count),
        tableName: '餐廳',
        total: total_restaurants,
        thisMonth: Object.values(rest_result).reduce((total, current) => total + Number(current.count), 0)
      }

      // adjust user data format for front-end
      users = {
        labels: ['訂閱中', '未訂閱'],
        data: [users[0].dataValues.subscribeUsers, users[0].dataValues.nonsubscribeUsers],
        tableName: '會員',
        total: Number(users[0].dataValues.subscribeUsers) + Number(users[0].dataValues.nonsubscribeUsers)
      }

      // adjust subscriptions data format for front-end
      const subscriptions = {
        labels: dateArray,
        datasets: [
          {
            label: '10餐',
            data: light_package
          },
          {
            label: '20餐',
            data: heavy_package
          },
        ],
        tableName: '訂閱',
        total: light_package[light_package.length - 1] + heavy_package[heavy_package.length - 1]
      }
      res.status(200).json({ status: 'success', userIncreased, restIncreased, subtIncreased, order_num, subscriptions, restaurants, users, orders, message: 'Successfully get admin dashboard info' })

    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = adminController
