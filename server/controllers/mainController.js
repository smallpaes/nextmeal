const db = require('../models')
const sequelize = require('sequelize')
const districts = require('../location/district.json')
const Restaurant = db.Restaurant
const Category = db.Category
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')

const pageLimit = 6

let mainController = {
  getRestaurants: async (req, res) => {
    try {
      let popular_restaurants = await Restaurant.findAll({
        include: [ {model: Category, attributes: ['name', 'image']} ],
        attributes: [
          'id', 'image', 'name', 'rating','description',
          [sequelize.literal(customQuery.Comment.RestaurantId), 'commentCount'],
          'CategoryId'
        ],
        order: [['rating','DESC'], [sequelize.literal('commentCount DESC')]], //評分和評論數量排列
        limit: pageLimit
      })
      return res.status(200).json({ status: 'success', popular_restaurants, districts, message: 'Get main page information.'})
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = mainController