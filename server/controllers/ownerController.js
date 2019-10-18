const db = require('../models')
const Restaurant = db.Restaurant

let ownerController = {
  getRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurant.findAll({
        where: {UserId: req.user.id}
      })
      if (restaurant.length === 0) {
        return res.status(200).json({status: 'success',  message: 'You have not restaurant yet.'})
      }
      res.status(200).json({status: 'success', restaurant, message: 'Successfully get the restaurant information.'})
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },
  
}

module.exports = ownerController