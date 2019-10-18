const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Restaurant = db.Restaurant
const Meal = db.Meal
const { validMessage } = require('../middleware/middleware')

const mealQuantities = 50

let ownerController = {
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findAll({
        where: { UserId: 5 }
      })
      if (restaurant.length === 0) {
        return res.status(200).json({ status: 'success', message: 'You have not restaurant yet.' })
      }
      res.status(200).json({ status: 'success', restaurant, message: 'Successfully get the restaurant information.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  postRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurant.findAll({ where: { UserId: 1 } })
      if (restaurant) return res.status(422).json({ status: 'error', message: 'You already have a restaurant.' });
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
            latitude: req.body.lat,
            longitude: req.body.lng,
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
          latitude: req.body.lat,
          longitude: req.body.lng,
          UserId: req.user.id
        })
        return res.status(200).json({
          status: 'success',
          message: 'Successfully create the restaurant information.'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },

  putRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } })
      if (!restaurant) {
        return res.status(400).json({ status: 'error', message: 'The restaurant is not exist.' })
      }
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

  getDishes: async (req, res) => {
    try {
      let restaurant = await Restaurant.findAll({
        where: { UserId: req.user.id },
        include: [Meal],
        attributes: ['id']
      })
      if (restaurant[0].dataValues.Meals.length === 0 || restaurant.length === 0) {
        res.status(422).json({ status: 'error', message: 'You haven\'t setting restaurant or meal yet.' })
      }
      let meals = restaurant.map(rest => rest.dataValues.Meals)
      meals = meals[0].map(meal => meal.dataValues)
      res.status(200).json({ status: 'success', meals, message: 'Successfully get the dish information.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  postDish: async (req, res) => {
    try {
      let restaurant = await Restaurant.findOne({
        where: { UserId: req.user.id },
        include: [Meal],
        attributes: ['id']
      })
      let mealServeing = restaurant.dataValues.Meals.map(rest => rest.dataValues.isServing).includes(true)
      if (restaurant.length === 0) {
        res.status(422).json({ status: 'error', message: 'You haven\'t setting restaurant yet.' })
      }
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
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },

  putDish: async (req, res) => {
    try {
      let meal = await Meal.findByPk(req.params.dish_id)
      if (!meal) {
        return res.status(422).json({ status: 'error', message: 'meal is not exist.' })
      }
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
      if (req.query.ran === 'nextWeek'){
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
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },

  putMenu: async (req, res) => {
    try {
      validMessage(req, res) //驗證表格
      // 找出要修改的 meal
      let meal = await Meal.findByPk(req.body.id)
      const today = new Date().getDay()
      // 修改 nextServing 為真，而且可以更改數量
      if (Number(req.body.quantity) < 1) {
        res.status(400).json({status: 'error', message: 'the menu\'s quantity not allow 0 or negative for next week'})
      }
      if (today >= 6) {
        res.status(400).json({status: 'error', message: 'Today can not edit next week\'s menu.'})
      }
      if (!meal || Number(req.body.quantity) > 0) {
        await meal.update({
          name: req.body.name || meal.name,
          quantity: req.body.quantity || meal.quantity,
          nextServing: 1
        })
        res.status(200).json({ status: 'success', message: 'Successfully setting menu for next week' })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = ownerController