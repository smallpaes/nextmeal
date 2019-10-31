const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const sequelize = require('sequelize')
const Op = sequelize.Op
const Restaurant = db.Restaurant
const Category = db.Category
const Meal = db.Meal
const Order = db.Order
const User = db.User
const { validMessage } = require('../middleware/middleware')
const moment = require('moment')
const mealQuantities = 50
const _ = require('underscore')

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
      if (restaurant.length === 0) {
        return res.status(200).json({ status: 'success', categories, message: 'You have not restaurant yet.' })
      }

      const categories = await Category.findAll({
        attributes: ['id', 'name']
      })
      res.status(200).json({ status: 'success', restaurant, categories, message: 'Successfully get the restaurant information.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  postRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurant.findAll({ where: { UserId: req.user.id } })
      if (restaurant.length > 0) return res.status(400).json({ status: 'error', message: 'You already have a restaurant.' });
      const point = sequelize.fn('ST_GeomFromText', `POINT(${req.body.lng} ${req.body.lat})`)

      const { file } = req
      validMessage(req, res)
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            name: req.body.name,
            description: req.body.description,
            image: img.data.link,
            tel: req.body.tel,
            rating: 0,
            location: req.body.location,
            CategoryId: req.body.CategoryId,
            address: req.body.address,
            opening_hour: req.body.opening_hour,
            closing_hour: req.body.closing_hour,
            lat: req.body.lat,
            lng: req.body.lng,
            geometry: point,
            UserId: req.user.id
          })
          return res.status(200).json({
            status: 'success',
            message: 'Successfully create the restaurant information with image.'
          })
        })
      } else {
        await Restaurant.create({
          name: req.body.name,
          description: req.body.description,
          image: 'https://cdn.pixabay.com/photo/2016/11/18/14/05/brick-wall-1834784_960_720.jpg',
          tel: req.body.tel,
          rating: 0,
          location: req.body.location,
          CategoryId: req.body.CategoryId,
          address: req.body.address,
          opening_hour: req.body.opening_hour,
          closing_hour: req.body.closing_hour,
          lat: req.body.lat,
          lng: req.body.lng,
          geometry: point,
          UserId: req.user.id
        })
        return res.status(200).json({
          status: 'success',
          message: 'Successfully create the restaurant information.'
        })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  putRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } })
      if (!restaurant) {
        return res.status(400).json({ status: 'error', message: 'The restaurant is not exist.' })
      }
      const point = sequelize.fn('ST_GeomFromText', `POINT(${req.body.lng} ${req.body.lat})`)
      validMessage(req, res)
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
            CategoryId: req.body.CategoryId,
            opening_hour: req.body.opening_hour,
            closing_hour: req.body.closing_hour,
            lat: req.body.lat,
            lng: req.body.lng,
            geometry: point,
          })
          return res.status(200).json({
            status: 'success',
            message: 'Successfully update restaurant information with image.'
          })
        })
      } else {
        await restaurant.update({
          ...req.body,
          geometry: point,
        })
        return res.status(200).json({
          status: 'success',
          message: 'Successfully update restaurant information.'
        })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getDishes: async (req, res) => {
    try {
      let restaurant = await Restaurant.findAll({
        where: { UserId: req.user.id },
        include: [Meal],
        attributes: ['id']
      })
      if (restaurant.length === 0 || restaurant[0].dataValues.Meals.length === 0) {
        return res.status(422).json({ status: 'error', message: 'You haven\'t setting restaurant or meal yet.' })
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
      let mealServeing = restaurant.dataValues.Meals.map(rest => rest.dataValues.isServing).includes(true)
      // if (restaurant[0].dataValues.Meals.length > 0) {
      //   res.status(422).json({status: 'error', message: 'the multiple meals of feature is not available for the moment.'})
      // }
      validMessage(req, res) //驗證表格
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          if (!mealServeing) {
            await Meal.create({
              ...req.body,
              image: file ? img.data.link : 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_960_720.jpg',
              RestaurantId: restaurant.id,
              quantity: mealQuantities,
              modifiedAt: null,
              isServing: 1,
              nextServing: false
            })
          } else {
            await Meal.create({
              ...req.body,
              image: file ? img.data.link : 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_960_720.jpg',
              RestaurantId: restaurant.id,
              quantity: mealQuantities,
              modifiedAt: null,
              isServing: 0,
              nextServing: 0
            })
          }
          return res.status(200).json({
            status: 'success',
            message: 'Successfully create a meal with image.'
          })
        })
      } else {
        if (!mealServeing) {
          await Meal.create({
            ...req.body,
            image: 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_960_720.jpg',
            RestaurantId: restaurant.id,
            quantity: mealQuantities,
            modifiedAt: null,
            isServing: 1,
            nextServing: 0
          })
        } else {
          await Meal.create({
            ...req.body,
            image: 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_960_720.jpg',
            RestaurantId: restaurant.id,
            quantity: mealQuantities,
            modifiedAt: null,
            isServing: 0,
            nextServing: 0
          })
        }
        res.status(200).json({ status: 'success', message: 'Successfully create a meal.' })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getDish: async (req, res) => {
    try {
      let meal = await Meal.findByPk(req.params.dish_id)
      if (!meal) {
        return res.status(422).json({ status: 'error', message: 'meal is not exist.' })
      }

      res.status(200).json({ status: 'success', meal, message: 'Successfully get the dish information.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  putDish: async (req, res) => {
    try {
      let meal = await Meal.findByPk(req.params.dish_id, {
        include: [{ model: Restaurant, attributes: ['UserId'] }]
      })
      if (!meal) {
        return res.status(422).json({ status: 'error', message: 'meal is not exist.' })
      }
      if (meal.Restaurant.UserId !== req.user.id) return res.status(422).json({ status: 'error', message: 'You are not allow this action.' })

      validMessage(req, res) //驗證表格
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await meal.update({
            ...req.body,
            image: file ? img.data.link : meal.image,
          })
          return res.status(200).json({
            status: 'success',
            message: 'Successfully update a meal with image.'
          })
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
      let meal = await Meal.findByPk(req.params.dish_id)
      if (!meal) return res.status(422).json({ status: 'error', message: 'meal is not exist.' })

      await meal.destroy()
      res.status(200).json({ status: 'success', message: 'meal was successfully destroyed.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getMenu: async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        where: { UserId: 3 }, attributes: ['id'], include: [{ model: Meal, attributes: ['id', 'name'] }]
      })
      let whereQuery = {}
      let message = ''
      if (req.query.ran !== 'thisWeek' && req.query.ran !== 'nextWeek') {
        return res.status(400).json({ status: 'error', message: 'must query for this week or next week' })
      }

      if (req.query.ran === 'thisWeek') {
        whereQuery = { RestaurantId: restaurant.id, isServing: true }
        message = 'the meals for this week'
      }
      if (req.query.ran === 'nextWeek') {
        whereQuery = { RestaurantId: restaurant.id, nextServing: true }
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
      validMessage(req, res) //驗證表格
      let meal = await Meal.findByPk(req.body.id, {
        include: [Restaurant]
      })
      let nextWeeKMeal = await Meal.findOne({
        where: { nextServing: 1 },
        include: [{ model: Restaurant, where: { id: meal.Restaurant.id } }]
      })
      const today = new Date().getDay()
      // 修改 nextServing 為真，而且可以更改數量
      if (Number(req.body.quantity) < 1) {
        return res.status(400).json({ status: 'error', message: 'the menu\'s quantity not allow 0 or negative for next week' })
      }
      if (!meal) return res.status(200).json({ status: 'success', meal, message: 'null' })
      if (today >= 6) {
        return res.status(400).json({ status: 'error', message: 'Today can not edit next week\'s menu.' })
      }
      if (Number(req.body.quantity) > 0) {
        meal = await meal.update({
          nextServing_quantity: req.body.quantity || meal.quantity,
          nextServing: 1
        })
        await nextWeeKMeal.update({
          nextServing: 0
        })
        return res.status(200).json({ status: 'success', meal, message: 'Successfully setting menu for next week' })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrders: async (req, res) => {
    try {
      //算出今天開始、結束日期
      const start = moment().startOf('day').toDate()
      const end = moment().endOf('day').toDate()
      let restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } })
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
          [sequelize.fn('date_format', sequelize.col('require_date'), '%H:%i'), 'time'],
        ],
        order: [['require_date', 'ASC']],
      })
      orders = orders.map(order => ({
        ...order.dataValues,
        meals: order.dataValues.meals[0]
      }))
      orders = _.mapObject(_.groupBy(orders, 'time'))
      res.status(200).json({ status: 'success', orders, message: 'getOrders' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = ownerController
