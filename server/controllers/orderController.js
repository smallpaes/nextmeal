const db = require('../models')
const Subscription = db.Subscription
const Restaurant = db.Restaurant
const Meal = db.Meal
const Order = db.Order
const OrderItem = db.OrderItem
const moment = require('moment')
const sequelize = require('sequelize')
const Op = sequelize.Op
const { validMessage, getTimeStop } = require('../middleware/middleware')

let orderController = {
  getNew: async (req, res) => {
    try {
      const location = sequelize.literal(`ST_GeomFromText('POINT(${req.user.longitude} ${req.user.latitude})')`)
      const distance = sequelize.fn('ST_Distance_Sphere', sequelize.literal('geometry'), location)
      // 取得500公尺內的兩間餐廳，需要 rest's、meals、time slots
      let restaurants = await Restaurant.findAll({
        where: sequelize.where(distance, { [Op.lte]: 500 }),
        include: [{
          model: Meal,
          where: { isServing: true },
          attributes: ['id', 'name', 'image', 'description'],
          required: true
        }],
        attributes: [ 'id', 'name', 'rating', 'opening_hour', 'closing_hour',[distance, 'distance']], // distance
        order: sequelize.literal('rand()'), // 如果資料庫是 Postgres 使用 random()
        limit: 2
      })
      restaurants = restaurants.map((restaurant, index) => ({
        ...restaurant.dataValues,
        Meals: restaurant.dataValues.Meals[0].dataValues,
        distance: parseInt(restaurant.dataValues.distance),
        time_slots: getTimeStop(restaurants[index].opening_hour, restaurants[index].closing_hour)
      }))
      return res.status(200).json({ status: 'success', restaurants, message: 'Successfully get the new order page info' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  postNew: async (req, res) => {
    try {
      const quantity = Number(req.body.quantity) 
      let start = moment().startOf('day').toDate()
      const requireTime = req.body.require_date.split(':')

      let tomorrow = moment().add(1,'days').startOf('day')
      tomorrow.set('Hour', requireTime[0]).set('minute', requireTime[1])
      tomorrow = new Date(tomorrow).toISOString().replace('T', ' ').replace('Z', '').split('.000')[0]

      let meal = await Meal.findByPk(1)
      let subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: 1,
          sub_expired_date: { [Op.gte]: start }
        },
        order: [['sub_expired_date', 'DESC']],
        limit: 1
      })
      // 找不到 meal、庫存不足、order點超過庫存
      if (!meal) return res.status(400).json({ status: 'error', message: 'the meal does not exist.'})
      if (meal.quantity < 1 ) return res.status.json({ status: 'error', message: 'the meal is out of stock.'})
      if ((meal.quantity -quantity) < 0) {
        return res.status.json({status: 'error', message: 'order\'s quantity can not excess stock\'s quantity'})
      }
      if ((subscription.sub_balance - quantity) < 0) {
        return res.status.json({status: 'error', message: 'order\'s quantity can not excess subscription\'s sub_balance'})
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
        attributes: ['id', 'order_date', 'require_date', 'order_status']
      })
      if (!order) return res.status(400).json({ status: 'error', order, message: 'getOrder' })
      order = { ...order.dataValues, meals: order.dataValues.meals[0] }
      return res.status(200).json({ status: 'success', order, message: 'Successfully get the Order' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrderEdit: async (req, res) => {
    try {
      let start = moment().startOf('day').toDate()
      let end = moment().endOf('day').toDate()
      // 找出使用者目前 subscription 是否為有效
      const subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: 1,
          sub_expired_date: { [Op.gte]: start },
        },
        order: [['sub_expired_date', 'DESC']],
        limit: 1
      })
      // 需驗證剩下多少數量，取得數量，先取得本訂單
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
      // 為了給前端 time_slots 取得餐廳開店與關店時間
      let opening_hour = order.meals[0].dataValues.Restaurant.dataValues.opening_hour
      let closing_hour = order.meals[0].dataValues.Restaurant.dataValues.closing_hour
      let time_slots = getTimeStop(opening_hour, closing_hour)
      // 計算被訂購的數量，不用傳給前端
      let orders = await Order.findAll({
        where: {
          order_status: { [Op.notLike]: '取消' },
          updatedAt: { [Op.gte]: start, [Op.lte]: end }
        },
        include: [{
          model: Meal, as: 'meals', where: {
            id: order.meals[0].dataValues.id
          }
        }],
        attributes: [
          [sequelize.fn('sum', sequelize.col('amount')), 'total']
        ]
      })
      // 撈出 meal預設數量 order.meals[0].dataValues.quantity
      // 已經被訂購的數量   orders[0].dataValues.total
      // meal 總數 - (找出所有今天 orders 計算 quatity) 相減回傳數量
      let quantity = order.meals[0].dataValues.quantity - orders[0].dataValues.total
      order = { ...order.dataValues, meals: order.dataValues.meals[0].dataValues }
      // 回傳 subscription 數量，以及餐點剩餘數量
      return res.status(200).json({
        status: 'success',
        order, quantity, subscription, time_slots,
        message: 'Successfully edit Order information.'
      })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  putOrder: async (req, res) => {
    try {
      let start = moment().startOf('day').toDate()
      let end = moment().endOf('day').toDate()
      let newRequire_date = new Date(
        `
        ${new Date().getFullYear()}-
        ${new Date().getMonth() + 1}-
        ${new Date().getDate() + 1} ${req.body.require_date}
        `
      )
      // 找出使用者目前 subscription 是否為有效
      const subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: 1,
          sub_expired_date: { [Op.gte]: start },
        },
        order: [['sub_expired_date', 'DESC']],
        limit: 1
      })
      // 取得 order 數量
      let order = await Order.findByPk(req.params.order_id, {
        include: [{ model: Meal, as: 'meals', include: [Restaurant] }]
      })
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist' })
      validMessage(req, res)
      // meal 會減少直接當庫存
      let quantity = order.meals[0].dataValues.quantity
      // 修改後的庫存等於剩餘的 quantity + 使用者原訂購數量 - 新訂購數量，不得為負數，否則失敗
      let newQuantity = quantity + order.dataValues.amount - Number(req.body.quantity)
      // 修改後的sub_balance等於剩餘 sub_balance + 使用者原訂購數量 - 新訂購數量，不得為負數，否則失敗
      let newSub_balance = subscription.sub_balance + order.dataValues.amount - Number(req.body.quantity)
      // (驗證 subscription sub_balance - 傳進來的數字不小於 0) && (quantity - 傳進來的數字不小於 0)
      if (newSub_balance < 0) return res.status(400).json({ status: 'error', message: 'Your credit is not enough.' })
      if ((newSub_balance >= 0) && (newQuantity >= 0)) {
        // 調整訂閱數量
        await subscription.update({
          sub_balance: newSub_balance
        })
        // 更新原本訂單領餐日期
        order = await order.update({
          require_date: newRequire_date
        })
        // 更新訂單 order 和 orderitem 原本數量
        await order.update({ amount: req.body.quantity })
        let orderItem = await OrderItem.findOne({
          where: { OrderId: req.params.order_id }
        })
        orderItem.update({
          quantity: req.body.quantity,
        })
        // 修改 meal 的庫存
        let meal = await Meal.findByPk(order.meals[0].dataValues.id)
        await meal.update({
          quantity: newQuantity
        })
        return res.status(200).json({ status: 'success',order, message: 'Successfully edit Order information.' })
      }
      return res.status(400).json({ status: 'error', message: 'Store\'s quantity is none in stock.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  getComment: async (req, res) => {
    try {

      return res.status(200).json({ status: 'success', message: 'Successfully get user comment' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  putCancel: async (req, res) => {
    try {
      let start = moment().startOf('day').toDate()
      // 先取得本訂單，需驗證剩下多少數量，取得數量
      let order = await Order.findByPk(req.params.order_id, {
        include: [{ model: Meal, as: 'meals', include: [Restaurant] }]
      })
      if (!order) return res.status(400).json({ status: 'error', message: 'order does not exist.' })
      if (req.user.id !== order.UserId) return res.status(400).json({ status: 'error', message: 'You are not allow this action.' })
      let subscription = await Subscription.findOne({
        where: {
          UserId: order.UserId,
          payment_status: 1,
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
      return res.status(200).json({ status: 'success', message: 'Successfully cancel the order.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = orderController