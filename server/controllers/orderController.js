const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Subscription = db.Subscription
const Restaurant = db.Restaurant
const OrderItem = db.OrderItem
const Comment = db.Comment
const Order = db.Order
const Meal = db.Meal
const moment = require('moment-timezone')
const sequelize = require('sequelize')
const Op = sequelize.Op
const { getTimeStop, avgRating, sendEmail } = require('../middleware/middleware')
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')

let orderController = {
  getNew: async (req, res) => {
    try {
      const time = moment().add(1, 'days').startOf('day').toDate()
      const order = await Order.findAll({
        where: {
          UserId: req.user.id,
          require_date: { [Op.gte]: time },
          order_status: { [Op.notLike]: '取消' }
        }
      })
      if (order.length > 1) return res.status(400).json({ status: 'error', message: 'you are already ordered today' })
      // 取得500公尺內的兩間餐廳，需要 rest's、meals、time slots
      let restaurants = await Restaurant.findAll({
        include: [{
          model: Meal,
          where: {
            isServing: true,
            quantity: { [Op.gt]: 0 }
          },
          attributes: ['id', 'name', 'image', 'description', 'quantity'],
          required: true
        }],
        attributes: [ 'id', 'name', 'rating', 'opening_hour', 'closing_hour',
          [sequelize.literal('`lng` + 0'), 'lng_c'],
          [sequelize.literal('6371 * acos(cos(radians(' + req.user.lat + ')) * cos(radians(`lat`)) * cos(radians(`lng`) - radians(' + req.user.lng + ')) + sin(radians(' + req.user.lat + ')) * sin(radians(`lat`)))'), 'distance'],
        ],
        having: sequelize.literal(`distance < 0.5`),
        order: sequelize.literal('RAND()'),
        limit: 2
      })
      restaurants = restaurants.map((restaurant, index) => ({
        ...restaurant.dataValues,
        Meals: restaurant.dataValues.Meals[0].dataValues,
        distance: parseInt(restaurant.dataValues.distance * 1000),
        time_slots: getTimeStop(restaurants[index].opening_hour, restaurants[index].closing_hour)
      }))
      return res.status(200).json({ status: 'success', restaurants, message: 'Successfully get the new order page info' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  postNew: async (req, res) => {
    try {
      let start = moment().startOf('day').toDate()
      let meal = await Meal.findByPk(req.body.meal_id, {
        include: [Restaurant]
      })
      let subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: true,
          sub_expired_date: { [Op.gte]: start },
          sub_balance: { [Op.gt]: 0 }
        },
        order: [['sub_expired_date', 'DESC']]
      })
      // 找不到 meal、庫存不足、order點超過庫存
      if (!subscription) return res.status(400).json({ status: 'error', message: 'you are not authorized to do that' })
      if (!meal) return res.status(400).json({ status: 'error', message: 'the meal does not exist.' })
      // if (!meal.isServing) return res.status(400).json({ status: 'error', message: 'the meal does not serving today.' }) 
      const regex = new RegExp('^([0-1]?[0-9]|2[0-4]):([0-5][0-9])?$')
      const timeValid = regex.test(req.body.require_date)
      if (!timeValid) return res.status(400).json({ status: 'error', message: 'this is not correct time formats for nextmeal need' })
      const quantity = Number(req.body.quantity)
      const requireTime = req.body.require_date.split(':')
      let tomorrow = moment().add(1, 'days').startOf('day')
      tomorrow.set('Hour', requireTime[0]).set('minute', requireTime[1])
      tomorrow = tomorrow.toDate()

      if (meal.quantity < 1) return res.status(400).json({ status: 'error', message: 'the meal is out of stock.' })
      if ((meal.quantity - quantity) < 0) {
        return res.status(400).json({ status: 'error', message: 'order\'s quantity can not excess stock\'s quantity' })
      }
      if ((subscription.sub_balance - quantity) < 0) {
        return res.status(400).json({ status: 'error', message: 'order\'s quantity can not excess subscription\'s sub_balance' })
      }
      // 回傳 order_id
      let order = await Order.create({ // UserId、require_date、amount，order_date、order_status 預設
        UserId: req.user.id,
        amount: quantity,
        require_date: tomorrow
      })
      await OrderItem.create({ // 紀錄 order_id、meal_id、數量 
        OrderId: order.id,
        MealId: meal.id,
        quantity: quantity
      })
      await meal.update({ //減少庫存
        quantity: meal.quantity - quantity
      })
      subscription = await subscription.update({ // 減少點數
        sub_balance: subscription.sub_balance - quantity
      })
      const emailInfo = {
        email: req.user.email,
        template: 'orderInfo',
        subject: '【Nextmeal】訂購餐點已確認 ',
        order: {
          ...order.dataValues,
          order_date: moment(order.order_date).format('YYYY-MM-DD HH:mm'),
          require_date: moment(order.require_date).format('YYYY-MM-DD HH:mm'),
        },
        meal,
        subscription
      }
      sendEmail(req, res, emailInfo)
      return res.status(200).json({ status: 'success', order_id: order.id, message: 'Successfully order the meal.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  getOrder: async (req, res) => {
    try {
      let order = await Order.findByPk(req.params.order_id, {
        include: [
          {
            model: Meal,
            as: 'meals',
            include: [Restaurant],
            attributes: ['id', 'name', 'description', 'image', 'quantity']
          }
        ],
        attributes: ['id', 'order_date', 'require_date', 'order_status', 'UserId']
      })

      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist' })
      order = { ...order.dataValues, meals: order.dataValues.meals[0] }
      if (Number(req.user.id) !== Number(order.UserId)) return res.status(400).json({ status: 'error', order, message: 'you are not allow do this action' })
      return res.status(200).json({ status: 'success', order, message: 'Successfully get the Order' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrderEdit: async (req, res) => {
    try {
      let start = moment().startOf('day').toDate()
      // 找出使用者目前 subscription 是否為有效
      const subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: true,
          sub_expired_date: { [Op.gte]: start },
        },
        order: [['sub_expired_date', 'DESC']]
      })
      if (!subscription) return res.status(400).json({ status: 'error', subscription, message: 'you are not authorized to do that' })
      // 取得訂單
      let order = await Order.findByPk(req.params.order_id, {
        include: [
          {
            model: Meal,
            as: 'meals',
            include: [Restaurant],
            attributes: ['id', 'name', 'description', 'image', 'quantity']
          }
        ],
        attributes: ['id', 'amount', 'order_date', 'require_date']
      })
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist' })
      if (order.meals.length === 0 || !order.meals[0].dataValues.Restaurant) {
        return res.status(400).json({ status: 'error', message: 'meal or restaurant does not exist' })
      }
      // 為了給前端 time_slots 取得餐廳開店與關店時間
      let opening_hour = order.meals[0].dataValues.Restaurant.dataValues.opening_hour
      let closing_hour = order.meals[0].dataValues.Restaurant.dataValues.closing_hour
      let time_slots = getTimeStop(opening_hour, closing_hour)

      order = { ...order.dataValues, meals: order.dataValues.meals[0].dataValues }
      // 回傳 subscription 數量，以及餐點剩餘數量
      return res.status(200).json({
        status: 'success',
        order, subscription, time_slots,
        message: 'Successfully edit Order information.'
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  putOrder: async (req, res) => {
    try {
      let start = moment().startOf('day').toDate()
      // 找出使用者目前 subscription 是否為有效
      let subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: true,
          sub_expired_date: { [Op.gte]: start },
        },
        order: [['sub_expired_date', 'DESC']],
        limit: 1
      })
      if (!subscription) return res.status(400).json({ status: 'error', subscription: null, message: 'you are not authorized to do that' })
      // 取得 order 數量
      let order = await Order.findByPk(req.params.order_id, {
        include: [{ model: Meal, as: 'meals', include: [Restaurant] }]
      })
      if (req.user.id !== Number(order.UserId)) return res.status(400).json({ status: 'error', order, message: 'you are not allow do this action' })
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist' })
      const requireTime = req.body.require_date.split(':')
      let tomorrow = moment().add(1, 'days').startOf('day')
      tomorrow.set('Hour', requireTime[0]).set('minute', requireTime[1])
      tomorrow = tomorrow.toDate()
      // meal 會減少直接當庫存
      let quantity = order.meals[0].dataValues.quantity
      // 修改後的庫存等於剩餘的 quantity + 使用者原訂購數量 - 新訂購數量，不得為負數，否則失敗
      let newQuantity = quantity + order.amount - Number(req.body.quantity)
      // 修改後的sub_balance等於剩餘 sub_balance + 使用者原訂購數量 - 新訂購數量，不得為負數，否則失敗
      let newSub_balance = subscription.sub_balance + order.amount - Number(req.body.quantity)
      // (驗證 subscription sub_balance - 傳進來的數字不小於 0) && (quantity - 傳進來的數字不小於 0)
      if (newSub_balance < 0) return res.status(400).json({ status: 'error', message: 'Your credit is not enough.' })
      if ((newSub_balance >= 0) && (newQuantity >= 0)) {
        // 調整訂閱數量
        await subscription.update({
          sub_balance: newSub_balance
        })
        // 更新原本訂單領餐日期
        order = await order.update({
          require_date: tomorrow,
          amount: Number(req.body.quantity)
        })
        // 更新訂單 order 和 orderitem 原本數量
        let orderItem = await OrderItem.findOne({
          where: { OrderId: req.params.order_id }
        })
        orderItem.update({
          quantity: Number(req.body.quantity),
        })
        // 修改 meal 的庫存
        let meal = await Meal.findByPk(order.meals[0].id, {
          include: [Restaurant]
        })
        await meal.update({
          quantity: newQuantity
        })
        const emailInfo = {
          email: req.user.email,
          template: 'orderInfo',
          subject: '【Nextmeal】訂購餐點已修改',
          order: {
            ...order.dataValues,
            order_date: moment(order.order_date).format('YYYY-MM-DD HH:mm'),
            require_date: moment(order.require_date).format('YYYY-MM-DD HH:mm'),
          },
          meal,
          subscription
        }
        sendEmail(req, res, emailInfo)
        return res.status(200).json({ status: 'success', order, message: 'Successfully edit Order information.' })
      }
      return res.status(400).json({ status: 'error', message: 'Store\'s quantity is none in stock.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  getComment: async (req, res) => {
    try {
      // 11/1 加入hasComment 後續判斷要使用 by Danny
      let order = await Order.findByPk(req.params.order_id, {
        include: [{
          model: Meal,
          as: 'meals',
          include: [{ model: Restaurant, attributes: ['id', 'name'] }],
          attributes: ['name', 'image', 'description']
        }],
        attributes: ['order_date', 'require_date', 'amount', 'UserId', 'hasComment']
      })
      // 11/1 調整判斷的順序 by Danny
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist' })
      if (req.user.id !== Number(order.UserId)) {
        return res.status(400).json({ status: 'error', message: 'You are not allow to get this information.' })
      }
      if (order.hasComment) return res.status(400).json({ status: 'error', message: 'This order has already been commented.' })
      order = { ...order.dataValues, meals: order.dataValues.meals[0] }
      return res.status(200).json({ status: 'success', order, message: 'Successfully get user comment page\'s  information.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  postComment: async (req, res) => {
    try {
      let order = await Order.findByPk(req.params.order_id, {
        include: [{
          model: Meal,
          as: 'meals',
          include: [{ model: Restaurant, attributes: ['id'] }]
        }]
      })
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist' })
      if (req.user.id !== Number(order.UserId)) {
        return res.status(200).json({ status: 'success', message: 'You are not allow to get this information.' })
      }
      if (order.hasComment) return res.status(200).json({ status: 'success', message: 'This order has already been commented.' })
      if (order.meals.length === 0 || order.meals[0] === undefined) {
        return res.status(200).json({ status: 'success', message: 'meal or restaurant does not exist' })
      }
      let restaurant = await Restaurant.findByPk(order.meals[0].RestaurantId)
      if (!restaurant) return res.status(400).json({ status: 'error', message: 'restaurant does not exist' })
      const { file } = req
      // 驗證表單
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          let comment = await Comment.create({
            user_text: req.body.user_text,
            rating: req.body.rating,
            image: await file ? img.data.link : null,
            UserId: req.user.id,
            RestaurantId: order.meals[0].RestaurantId
          })
          avgRating(res, restaurant, comment, order)
        })
      } else {
        let comment = await Comment.create({
          user_text: req.body.user_text,
          rating: req.body.rating,
          UserId: req.user.id,
          RestaurantId: order.meals[0].RestaurantId
        })
        avgRating(res, restaurant, comment, order)
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  putCancel: async (req, res) => {
    try {
      // 先取得本訂單，需驗證剩下多少數量，取得數量
      let order = await Order.findByPk(req.params.order_id, {
        include: [{ model: Meal, as: 'meals' }]
      })
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist.' })
      if (req.user.id !== Number(order.UserId)) return res.status(400).json({ status: 'error', message: 'You are not allow this action.' })
      let meal = await Meal.findByPk(order.meals[0].id, {
        include: [Restaurant]
      })
      if (!meal) return res.status(400).json({ status: 'error', message: 'meal does not exist.' })
      let start = moment().startOf('day').toDate()
      let subscription = await Subscription.findOne({
        where: {
          UserId: Number(order.UserId),
          payment_status: true,
          sub_expired_date: { [Op.gte]: start }
        },
        order: [['sub_expired_date', 'DESC']]
      })
      if (!subscription) return res.status(400).json({ status: 'error', subscription, message: 'you are not authorized to do that' })
      let returnNum = subscription.sub_balance + order.amount
      let returnQuantity = meal.quantity + order.amount
      if (order.order_status === '取消') return res.status(400).json({ status: 'error', message: 'order status had already cancel.' })
      await meal.update({
        quantity: returnQuantity
      })
      subscription = await subscription.update({
        sub_balance: returnNum
      })
      await order.update({
        order_status: '取消'
      })
      const emailInfo = {
        email: req.user.email,
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
      return res.status(200).json({ status: 'success', message: 'Successfully cancel the order.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = orderController
