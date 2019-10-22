const express = require('express')
const router = express.Router()

const mainController = require('../controllers/mainController')
const userController = require('../controllers/userController')

router.get('/', mainController.getRestaurants)


module.exports = router