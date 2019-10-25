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
      if (!order) return res.status(400).json({ status: 'success', message: 'order does not exist' })
      // 為了給前端 time_slots 取得餐廳開店與關店時間
      let opening_hour = moment(order.meals[0].dataValues.Restaurant.dataValues.opening_hour, 'HH:mm')
      let closing_hour = moment(order.meals[0].dataValues.Restaurant.dataValues.closing_hour, 'HH:mm')
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
      // 回傳 substription 數量，以及餐點剩餘數量
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
      ).toISOString().replace('T', ' ').replace('Z', '').split('.000')[0]

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
      // 需驗證剩下多少數量，取得數量
      let order = await Order.findByPk(req.params.order_id, {
        include: [{ model: Meal, as: 'meals', include: [Restaurant] }]
      })
      if (!order) return res.status(400).json({ status: 'success', message: 'order does not exist' })
      validMessage(req, res)
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
      // meal預設數量 order.meals[0].dataValues.quantity
      // 已被訂購的數量  orders[0].dataValues.total
      // meal 總數 - (找出所有今天 orders 已被訂購的數量) 相減回傳數量 (未修改前)
      let quantity = order.meals[0].dataValues.quantity - orders[0].dataValues.total
      // 修改時， 剩餘 quantity + 使用者原訂購數量 - 新訂購數量，不得為負數，否則失敗
      let newQuantity = quantity + order.dataValues.amount - Number(req.body.quantity)
      // 修改時， 剩餘 sub_balance + 使用者原訂購數量 - 新訂購數量，不得為負數，否則失敗
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
        return res.status(200).json({ status: 'success', message: 'Successfully edit Order information.' })
      }
      return res.status(400).json({ status: 'error', message: 'Store\'s quantity is none in stock.' })
    } catch (error) {
      console.log(error)
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
      if (req.user.id !== order.UserId) return res.status(400).json({ status: 'error', message: 'You are not allow this action.' })
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
  },
}

module.exports = orderController