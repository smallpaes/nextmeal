const db = require('../models')

let ownerController = {
  getRestaurant: async (req, res) => {
    try {
      res.status(200).json({status: 'success', message: 'Successfully get the restaurant information.'})
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  }

}

module.exports = ownerController