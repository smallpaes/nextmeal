const db = require('../models')
const sequelize = require('sequelize')
const districts = require('../location/district.json')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const customQuery = process.env.heroku ? require('../config/query/heroku') : require('../config/query/general')

const pageLimit = 6
const commentLimit = 4

let restController = {
  getRestaurants: async (req, res) => {
    try {
      if (!req.query.dist) return res.status(200).json({ status: 'error', more_restaurants, message: 'need to query dist some where' })
      // 設定尋找需求
      let page = Number(req.query.page)
      let wherequery = {}
      if (req.query.dist) {
        wherequery['location'] = req.query.dist
      }
      // 依照傳入 query.page 判斷是否需要找熱門跟地圖點， count 扣除最熱門數量
      if (page > 1) {
        let more_restaurants = await Restaurant.findAndCountAll({
          where: wherequery,
          include: [{ model: Category, attributes: ['name', 'image'] }],
          attributes: [
            'id', 'image', 'name', 'rating', 'description',
            [sequelize.literal(customQuery.Comment.RestaurantId), 'commentCount'],
            'CategoryId'
          ],
          order: [['rating', 'DESC'], [sequelize.literal('"commentCount" DESC')]], //評分和評論數量排列
          offset: page * pageLimit,
          limit: pageLimit
        })
        more_restaurants.count = more_restaurants.count - 6
        more_restaurants.pages = Math.ceil((more_restaurants.count) / pageLimit)

        return res.status(200).json({ status: 'success', more_restaurants, message: 'Get all restaurants page info' })
      }

      // 第一次進入抓熱門、更多(近來就算第一頁)
      let popular_restaurants = await Restaurant.findAndCountAll({
        where: wherequery,
        include: [{ model: Category, attributes: ['name', 'image'] }],
        attributes: [
          'id', 'image', 'name', 'rating', 'description',
          [sequelize.literal(customQuery.Comment.RestaurantId), 'commentCount'],
          'CategoryId'
        ],
        order: [['rating', 'DESC'], [sequelize.literal('"commentCount" DESC')]], //評分和評論數量排列
        limit: pageLimit * 2
      })
      const more_restaurants = {
        count: popular_restaurants.count - 6,
        pages: Math.ceil((popular_restaurants.count - 6) / pageLimit),
        restaurants: popular_restaurants.rows.slice(6)
      }
      popular_restaurants = popular_restaurants.rows.slice(0, 6)

      // 第一次進入的地圖點
      const district = districts.find(dist => { return dist.chinese_name === req.query.dist })
      const restaurants = await Restaurant.findAll({
        where: wherequery,
        attributes: ['id', 'name', 'lat', 'lng'],
      })
      const map = {
        center: {
          chinese_name: district.chinese_name,
          eng_name: district.eng_name,
          lng: district.lng,
          lat: district.lat
        },
        restaurants
      }
      return res.status(200).json({ 
        status: 'success', popular_restaurants,
        more_restaurants, map, districts,
        message: 'Successfully get all restaurants page info'
      })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getRestaurant: async (req, res) => {
    try {      
      let page = (Number(req.query.page) < 1 || req.query.page === undefined) ? 1 : Number(req.query.page)
      let restaurant, district
      if (req.params.restaurant_id) {
        // 個別餐廳評論近來就算第一頁
        if (page === 1) {
          restaurant = await Restaurant.findByPk(req.params.restaurant_id, {
            include: [{ model: Category, attributes: ['name'] }],
            attributes: [
              'id', 'image', 'name', 'rating',
              'description', 'tel', 'address',
              'opening_hour', 'closing_hour', 'location', 'lat', 'lng',
              [sequelize.literal(customQuery.Comment.RestaurantId), 'commentCount'],
              'CategoryId'
            ]
          })
          // 餐廳行政區資訊
          district = districts.find(dist => { return dist.chinese_name === restaurant.location })
        }
        let comments = await Comment.findAndCountAll({
          where: { RestaurantId: req.params.restaurant_id },
          include: [{model: User, attributes: ['id', 'name', 'avatar']}], //使用者名稱、照片、評分、評論內容
          attributes: ['id', 'user_text', 'res_text', 'rating', 'createdAt'],
          offset: (page - 1) * commentLimit,
          limit: commentLimit
        })
        comments.pages = Math.ceil((comments.count) / commentLimit)
        return res.status(200).json({
          status: 'success',
          restaurant,
          comments,
          district,
          districts,
          message: 'Successfully get more comments.'
        })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = restController