const express = require('express')
const router = express.Router()
// 引入 restController
const restController = require('../controllers/restController.js')

router.get('/', restController.getRestaurants)
router.get('/:restaurant_id', restController.getRestaurant)

module.exports = router