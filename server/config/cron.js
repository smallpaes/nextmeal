const cron = require('node-cron')
const https = require('https')
const db = require('../models')
const Order = db.Order
const Meal = db.Meal
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment-timezone')
const URL = process.env.URL

//每日訂單更新(明日->今日) 以及庫存數量回復本周的設定值
cron.schedule('59 23 * * *', async () => {
  try {
    // 撈出所有今日的訂單
    let orders = await Order.findAll({
      include: [{ model: Meal, as: 'meals' }],
      where: {
        order_status: { [Op.like]: '今日' },
        require_date: {
          [Op.gte]: moment().subtract(1, 'day').toDate(),
          [Op.lte]: moment().toDate()
        }
      }
    })

    // 加總今日訂單個別餐點的點餐量，以物件方式儲存供等一下的資料庫更新使用
    let results = orders.reduce((obj, item) => {
      if (item.meals[0].dataValues.id in obj) {
        obj[item.meals[0].dataValues.id] += Number(item.amount)
      } else {
        obj[item.meals[0].dataValues.id] = Number(item.amount)
      }
      return obj
    }, {})

    // 將餐點的數量藉由前一步的加總結果回復原始的數值(剩餘數量+今天點餐數量)
    async function handleResult(results) {
      for (item in results) {
        const meal = await Meal.findByPk(item)
        let currentAmount = meal.quantity
        meal.update({ quantity: Number(currentAmount) + Number(results[item]) })
      }
    }

    // 執行函數
    handleResult(results)

    // 撈出所有訂單狀態為明日的訂單並更新訂單狀態為今日
    let orders_tmr = await Order.findAll({
      where: {
        order_status: { [Op.like]: '明日' }
      }
    })
    orders_tmr.map(async item => {
      await item.update({ order_status: '今日' })
    })

  } catch (error) {
    console.log(error);
  }


})

//每周菜單更新(下周->本周)

cron.schedule('00 00 * * 0', async () => {

  // 撈出所有下周供應的餐點
  const meals = await Meal.findAll({
    where: {
      nextServing: true
    }
  })

  // 更新供應狀態與數量
  meals.map(async item => {
    await item.update({
      isServing: true,
      quantity: item.nextServing_quantity
    })
  })
})

cron.schedule('*/30 * * * *', () => {
  https.get(`${URL}/api`)
})