const { uploadImage, getImageRelativePath } = require('../_helpers')
const db = require('../models')
const sequelize = require('sequelize')
const Op = sequelize.Op
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const Meal = db.Meal
const Order = db.Order
const User = db.User
const moment = require('moment-timezone');
const _ = require('underscore')
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')

let ownerController = {
  getRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurant.findAll({
        where: { UserId: req.user.id },
        include: [{ model: Category, attributes: ['id', 'name'] }],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })
      const categories = await Category.findAll({
        attributes: ['id', 'name']
      })
      if (restaurant.length === 0) {
        return res.status(200).json({ status: 'success', categories, message: 'You have not restaurant yet.' })
      }
      return res.status(200).json({ status: 'success', restaurant, categories, message: 'Successfully get the restaurant information.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  postRestaurant: async (req, res) => {
    try {
      let { lat, lng } = req.body
      if (!lat || !lng) return res.status(400).json({ status: 'error', message: 'need lat and lng' })
      let restaurant = await Restaurant.findAll({ where: { UserId: req.user.id } })
      if (restaurant.length > 0) return res.status(400).json({ status: 'error', message: 'You already have a restaurant.' });
      const point = sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`)
      const { file } = req
      if (!file) return res.status(400).json({ status: 'error', message: 'You need to pick a picture' })
    
      const fileName = `restaurant-${req.body.name}`;
      const folder = '/Nextmeal/Restaurant';
      const { url } = await uploadImage(file.buffer, fileName, folder);
      await Restaurant.create({
        ...req.body,
        image: getImageRelativePath(url),
        lat: lat,
        lng: lng,
        geometry: point,
        UserId: req.user.id
      })
      return res.status(200).json({
        status: 'success',
        message: 'Successfully create the restaurant information with image.'
      })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },
  putRestaurant: async (req, res) => {
    try {
      const { lat, lng } = req.body
      if (!lat || !lng) return res.status(400).json({ status: 'error', message: 'can not find address' })
      let restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } })
      if (!restaurant) {
        return res.status(400).json({ status: 'error', message: 'The restaurant does not exist.' })
      }
      const point = sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`)
      const { file } = req
      let image = restaurant.image;
      if (file) {
        const fileName = `restaurant-${req.body.name}`;
        const folder = '/Nextmeal/Restaurant';
        const { url } = await uploadImage(file.buffer, fileName, folder);
        image = getImageRelativePath(url);
      }
      await restaurant.update({
        name: req.body.name,
        description: req.body.description,
        image,
        tel: req.body.tel,
        address: req.body.address,
        CategoryId: req.body.CategoryId,
        opening_hour: req.body.opening_hour,
        closing_hour: req.body.closing_hour,
        lat: lat,
        lng: lng,
        geometry: point,
      })
      return res.status(200).json({
        status: 'success',
        message: 'Successfully update restaurant information with image.'
      })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getDishes: async (req, res) => {
    try {
      let restaurant = await Restaurant.findAll({
        where: { UserId: req.user.id },
        include: [{ model: Meal, where: { isDeleted: false } }],
        attributes: ['id', 'UserId']
      })
      if (restaurant.length === 0 || restaurant[0].dataValues.Meals.length === 0) {
        return res.status(200).json({ status: 'success', meals: [], message: 'You haven\'t setting restaurant or meal yet.' })
      }
      if (restaurant[0].dataValues.UserId !== req.user.id) {
        return res.status(400).json({ status: 'error', message: 'You are not allow do this action.' })
      }
      let meals = restaurant.map(rest => rest.dataValues.Meals)
      meals = meals[0].map(meal => meal.dataValues)
      return res.status(200).json({ status: 'success', meals, message: 'Successfully get the dish information.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  postDish: async (req, res) => {
    try {
      let restaurant = await Restaurant.findOne({
        where: { UserId: req.user.id },
        include: [Meal],
        attributes: ['id']
      })
      if (restaurant === null) {
        res.status(422).json({ status: 'error', message: 'You haven\'t setting restaurant yet.' })
      }
      const { file } = req
      if (!file) return res.status(400).json({ status: 'error', message: 'You need to pick a picture' })
      const fileName = `dish-${req.body.name}`;
      const folder = '/Nextmeal/Food';
      const { url } = await uploadImage(file.buffer, fileName, folder);
      if (restaurant.Meals.length === 0) {
        await Meal.create({
          ...req.body,
          image: getImageRelativePath(url),
          RestaurantId: restaurant.id,
          nextServing: true
        })
      } else {
        await Meal.create({
          ...req.body,
          image: getImageRelativePath(url),
          RestaurantId: restaurant.id,
        })
      }
      return res.status(200).json({
        status: 'success',
        message: 'Successfully create a meal with image.'
      })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getDish: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        include: [{ model: Restaurant, attributes: ['UserId'] }],
        where: { id: req.params.dish_id, isDeleted: false }
      })
      if (!meal) {
        return res.status(400).json({ status: 'error', meal, message: 'meal does not exist' })
      }
      if (meal.Restaurant.UserId !== req.user.id) {
        return res.status(401).json({ status: 'error', message: 'You are not allow do this action.' })
      }
      return res.status(200).json({ status: 'success', meal, message: 'Successfully get the dish information.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  putDish: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        include: [{ model: Restaurant, attributes: ['UserId'] }],
        where: { id: req.params.dish_id, isDeleted: false }
      })
      if (!meal) {
        return res.status(422).json({ status: 'error', message: 'meal is not exist.' })
      }
      if (meal.Restaurant.UserId !== req.user.id) return res.status(422).json({ status: 'error', message: 'You are not allow this action.' })
      const { file } = req
      if (file) {
        const fileName = `dish-${req.body.name}`;
        const folder = '/Nextmeal/Food';
        const { url } = await uploadImage(file.buffer, fileName, folder);
        await meal.update({
          ...req.body,
          image: getImageRelativePath(url),
        })
        return res.status(200).json({
          status: 'success',
          message: 'Successfully update a meal with image.'
        })
      } else {
        await meal.update(req.body)
        res.status(200).json({ status: 'success', message: 'Successfully update a meal.' })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  deleteDish: async (req, res) => {
    try {
      let meal = await Meal.findOne({
        where: {
          id: req.params.dish_id,
          isDeleted: false
        }
      })
      if (!meal) return res.status(422).json({ status: 'error', message: 'meal is not exist.' })

      await meal.update({ isDeleted: true })
      res.status(200).json({ status: 'success', message: 'meal was successfully destroyed.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getMenu: async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        where: { UserId: req.user.id }, attributes: ['id'],
        include: [{
          model: Meal, attributes: ['id', 'name'],
          where: {
            isDeleted: false
          }
        }]
      })
      if (!restaurant) return res.status(200).json({ status: 'success', meals: [], options: [], message: 'you do not have your restaurant info filled or a meal yet' })
      let whereQuery = {}
      let message = ''
      if (req.query.ran !== 'thisWeek' && req.query.ran !== 'nextWeek') {
        return res.status(400).json({ status: 'error', message: 'must query for this week or next week' })
      }

      if (req.query.ran === 'thisWeek') {
        whereQuery = { RestaurantId: restaurant.id, isServing: true, isDeleted: false }
        message = 'the meals for this week'
      }
      if (req.query.ran === 'nextWeek') {
        whereQuery = { RestaurantId: restaurant.id, nextServing: true, isDeleted: false }
        message = 'the meals for next week'
      }

      let meals = await Meal.findAll({ where: whereQuery })
      return res.status(200).json({
        status: 'success',
        meals,
        options: (req.query.ran === 'nextWeek') ? restaurant.Meals : undefined,
        message: message
      })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  putMenu: async (req, res) => {
    try {
      if (Number(req.body.quantity) < 1) {
        return res.status(400).json({ status: 'error', message: 'the menu\'s quantity not allow 0 or negative for next week' })
      }
      const today = moment().day()
      // 修改 nextServing 為真，而且可以更改數量
      if (today >= 6) {
        return res.status(400).json({ status: 'error', message: 'Today can not edit next week\'s menu.' })
      }
      let meal = await Meal.findOne({
        where: {
          id: req.body.id,
          isDeleted: false
        },
        include: [{ model: Restaurant, where: { UserId: req.user.id } }]
      })
      //要修改的 meal
      if (!meal) return res.status(400).json({ status: 'error', message: 'meal does not exist' })
      if (req.user.id !== meal.Restaurant.UserId) return res.status(400).json({ status: 'error', message: 'You are not allow do this action.' })
      let originNextWeeK = await Meal.findOne({
        where: { nextServing: true, isDeleted: false },
        include: [{ model: Restaurant, where: { UserId: req.user.id } }]
      })
      // 如果有先更新成 false
      if (originNextWeeK) {
        originNextWeeK = await originNextWeeK.update({
          nextServing: false
        })
      }
      meal = await Meal.findOne({
        where: {
          id: req.body.id
        }
      })
      meal = await meal.update({
        nextServing_quantity: req.body.quantity || meal.quantity,
        nextServing: true
      })
      return res.status(200).json({ status: 'success', meal, message: 'Successfully setting menu for next week' })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrders: async (req, res) => {
    try {
      //算出今天開始、結束日期
      const start = moment().startOf('day').utc().format()
      const end = moment().endOf('day').utc().format()
      const restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } })
      // 處理餐廳資料尚未創建的情況
      if (!restaurant) {
        return res.status(200).json({ status: 'success', orders: {}, message: 'You haven\'t provided your restaurant info yet.' })
      }
      if (req.user.id !== restaurant.UserId) return res.status(400).json({ status: 'error', message: 'you are not allow do this action' })
      let orders = await Order.findAll({
        where: {
          order_status: { [Op.like]: '今日' },
          require_date: {
            // 大於開始日
            [Op.gte]: start,
            // 小於結束日
            [Op.lte]: end
          }
        },
        include: [
          { model: Meal, as: 'meals', where: { RestaurantId: restaurant.id }, attributes: ['id', 'name', 'image'] },
          { model: User, attributes: ['id', 'name', 'email'] }
        ],
        attributes: [
          'id', 'require_date', 'order_status',
          customQuery.char.time,
        ],
        order: [['require_date', 'ASC']],
      })
      // 11/1 加入處理order不存在時的情況 by Danny
      if (orders.length === 0) {
        return res.status(200).json({ status: 'success', orders: {}, message: 'Can not find any orders' })
      }

      orders = orders.map(order => ({
        ...order.dataValues,
        meals: order.dataValues.meals[0]
      }))
      orders = _.mapObject(_.groupBy(orders, 'time'))
      return res.status(200).json({ status: 'success', orders, message: 'Successfully get Orders' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  dashborad: async (req, res) => {
    try {
      // 取得一個月前的時間做為區間起點
      const pass_one_month = moment().subtract(1, 'months').utc().format()

      // 取得該owner的餐廳資料
      const restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } })

      // query過去一個月內每日的訂單
      let orders = await Order.findAll({
        include: [
          { model: Meal, as: 'meals', where: { RestaurantId: restaurant.id }, attributes: [] }
        ],
        where: {
          require_date: {
            [Op.gte]: pass_one_month
          }
        },
        attributes: [
          customQuery.char.date_for_dashboard,
        ]
      })
      // 手動加總不同日期的訂單量
      let results = orders.reduce((obj, item) => {
        if (item.dataValues.date in obj) {
          obj[item.dataValues.date] += 1
        } else {
          obj[item.dataValues.date] = 1
        }
        return obj
      }, {})
      // 複寫orders的結果達到與group by相同的輸出
      orders = []
      for (i in results) {
        orders.push({
          date: i,
          count: results[i]
        })
      }
      // find all dates a month from now
      var dateArray = [];
      var currentDate = moment(pass_one_month).utc().format();
      var stopDate = moment().utc().format();
      while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('MM/DD'))
        currentDate = moment(currentDate).add(1, 'days').utc().format()
      };

      // check if there's missing dates
      const currentDates = orders.map(item => item.date)
      const missing_fields_order_mod = dateArray.filter(v => currentDates.indexOf(v) === -1)

      // create the an end result object for later sorting
      const order_result = orders.map(item => ({
        date: item.date,
        count: item.count
      }))

      // if missing fields exist,fill in with value 0
      missing_fields_order_mod.map(async item => {
        await order_result.push({ "date": item, count: 0 })
      })
      // sort the result 
      order_result.sort((a, b) => { return new Date(a["date"]) - new Date(b["date"]) })

      let users = await User.findAll({
        include: [{
          model: Order,
          where: {
            require_date: {
              [Op.gte]: pass_one_month,
            }
          },
          include: [{
            model: Meal,
            as: 'meals',
            where: { RestaurantId: restaurant.id },
            attributes: ['id', 'name', 'description', 'image']
          }]
        }],
        order: [['dob', 'DESC']]
      })
      // calculate user age and count by group
      let user_result = {
        "<20歲": 0,
        "20~30歲": 0,
        "30~40歲": 0,
        "40~50歲": 0,
        "50~60歲": 0,
        ">60歲": 0
      }
      users = users.map(item => (
        { age: moment().utc().diff(item.dob, 'years') }
      )).map(item => {
        if (item.age < 20) user_result["<20歲"]++
        if (item.age >= 20 && item.age < 30) user_result["20~30歲"]++
        if (item.age >= 30 && item.age < 40) user_result["30~40歲"]++
        if (item.age >= 40 && item.age < 50) user_result["40~50歲"]++
        if (item.age >= 50 && item.age < 60) user_result["50~60歲"]++
        if (item.age > 60) user_result[">60歲"]++
      })

      let comments = await Comment.findAll({
        where: { RestaurantId: restaurant.id },
        attributes: ['rating', [sequelize.literal(`COUNT(*)`), 'count']],
        group: ['rating']
      })

      // check if the rating has missing field
      const original_ratings = comments.map(item => item.dataValues.rating)
      const missing_fields = [1, 2, 3, 4, 5].filter(v => original_ratings.indexOf(v) === -1)

      // create the an end result object for later sorting
      const rating_result = comments.map(item => ({
        rating: item.dataValues.rating,
        count: item.dataValues.count
      }))

      // if missing fields exist,fill in with value 0
      missing_fields.map(async item => {
        await rating_result.push({ rating: item, count: 0 })
      })

      // sort the result
      const sorted = rating_result.sort((a, b) => { return b.rating - a.rating })


      // adjust rating data format for front-end
      const ratings = {
        labels: ['5星', '4星', '3星', '2星', '1星'],
        data: sorted.map(item => Number(item.count)),
        tableName: '滿意度',
        average: sorted.every(item => Number(item.count) === 0) ? 0 : Number.parseFloat(sorted.reduce((total, current) => total + Number(current.rating) * Number(current.count), 0) / sorted.reduce((total, current) => total + Number(current.count), 0)).toFixed(1)
      }
      // adjust comment data format for front-end
      comments = await Comment.findAll({
        where: { RestaurantId: restaurant.id },
        attributes: ['user_text', 'rating', customQuery.literal.name, 'createdAt'],
        order: [['createdAt', 'DESC'], ['rating', 'DESC']],
      })
      // adjust user data format for front-end
      users = {
        labels: Object.keys(user_result),
        data: Object.values(user_result),
        tableName: '客群',
        total: Object.values(user_result).reduce((total, current) => total + Number(current), 0)
      }
      // adjust order data format for front-end
      orders = {
        labels: dateArray,
        data: order_result.map(item => Number(item.count)),
        tableName: '訂單',
        total: Object.values(order_result).reduce((total, current) => total + Number(current.count), 0)
      }

      return res.status(200).json({ status: 'success', orders, comments, ratings, users, message: 'Successfully get owner dashboard' })

    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = ownerController
