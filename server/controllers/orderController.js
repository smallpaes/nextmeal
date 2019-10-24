const db = require('../models')
const Subscription = db.Subscription
const Restaurant = db.Restaurant
const OrderItem = db.OrderItem
const Meal = db.Meal
const Order = db.Order
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
      return res.status(200).json({ status: 'success', order, message: 'getOrder' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrderEdit: async (req, res) => {
    try {
      const start = moment().startOf('day').format()
      const end = moment().endOf('day').format()
      let time = moment().format('YYYY-MM-DD')
      // 找出使用者目前 subscription 是否為有效且 sub_balance
      const subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: 1,
          sub_expired_date: { [Op.gte]: time }
        }
      })
      // 需驗證剩下多少數量，取得數量
      let order = await Order.findByPk(req.params.order_id, {
        include: [
          {
            model: Meal,
            as: 'meals',
            include: [Restaurant],
            attributes: ['id', 'name', 'description', 'image', 'quantity']
          }
        ],
        attributes: ['id', 'order_date', 'require_date']
      })
      if (!order) return res.status(400).json({ status: 'success', message: 'order does not exist' })
      // 取得餐廳開店與關店時間
      let opening_hour = moment(order.meals[0].dataValues.Restaurant.dataValues.opening_hour, 'HH:mm')
      let closing_hour = moment(order.meals[0].dataValues.Restaurant.dataValues.closing_hour, 'HH:mm')
      let time_slots = getTimeStop(opening_hour, closing_hour)
      let orderItem = await OrderItem.findAll({
        where: {
          updatedAt: { [Op.gte]: start, [Op.lte]: end }
        },
        attributes: [
          [sequelize.fn('sum', sequelize.col('quantity')), 'total']
        ]
      })
      // 撈出 meal 預設數量 order.meals[0].dataValues.quantity
      // 已經被訂購的數量 orderItem[0].dataValues.total
      // meal 總數 - (找出所有今天 orders 計算 quatity) 相減回傳數量
      let quantity = order.meals[0].dataValues.quantity - orderItem[0].dataValues.total
      order = { ...order.dataValues, meals: order.dataValues.meals[0].dataValues }
      // 回傳 substription 數量，以及餐點剩餘數量
      return res.status(200).json({
        status: 'success',
        order, quantity, subscription, time_slots,
        message: 'Successfully edit Order information.'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  putOrder: async (req, res) => {
    try {
      const start = moment().startOf('day').format()
      const end = moment().endOf('day').format()
      // 找出使用者目前 subscription 是否為有效且 sub_balance 不等於 0 在扣除數量後不得為負數
      let subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: 1,
          sub_expired_date: { [Op.gte]: start }
        }
      })
      // 需驗證剩下多少數量，取得數量
      // 回傳 substription 數量，以及餐點剩餘數量
      let order = await Order.findByPk(req.params.order_id, {
        include: [
          {
            model: Meal,
            as: 'meals',
            include: [Restaurant],
            attributes: ['id', 'name', 'description', 'image', 'quantity']
          }
        ],
        attributes: ['id', 'order_date', 'require_date']
      })
      if (!order) return res.status(400).json({ status: 'success', message: 'order does not exist' })
      validMessage(req. res)
      let orderItem = await OrderItem.findAll({
        where: {
          updatedAt: { [Op.gte]: start, [Op.lte]: end }
        },
        attributes: [
          [sequelize.fn('sum', sequelize.col('quantity')), 'total']
        ]
      })
      // 撈出 meal 預設數量 order.meals[0].dataValues.quantity
      // 已經被訂購的數量 orderItem[0].dataValues.total
      // meal 總數 - (找出所有今天 orders 計算 quatity) 相減回傳數量
      let sub_balance = subscription.sub_balance
      let orderQuantity = order.meals[0].dataValues.OrderItem.dataValues.quantity
      let quantity = order.meals[0].dataValues.quantity - orderItem[0].dataValues.total

      // (驗證 subscription sub_balance - 傳進來的數字不小於 0) && (quantity - 傳進來的數字不小於 0)
      // console.log(sub_balance - req.body.quantity >= 0)
      // console.log(quantity - req.body.quantity >= 0)
      if ((sub_balance - Number(req.body.quantity) >= 0) && (quantity - Number(req.body.quantity) >= 0)) {
        // 調整訂閱數量 sub_balance + 原本的訂餐數量 - 新訂餐數量
        subscription = await subscription.update({
          sub_balance: sub_balance + orderQuantity - Number(req.body.quantity)
        })
        order = await order.update({
          require_date: req.body.require_date
        })
        orderItem = await OrderItem.findOne({
          where: { OrderId: req.params.order_id }
        })
        orderItem.update({
          quantity: req.body.quantity
        })
        return res.status(200).json({ status: 'success', order, subscription, orderItem, message: 'Successfully edit Order information.' })
      }
      // validMessage(req, res)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: error })
    }
  },
}

module.exports = orderController