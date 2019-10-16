const express = require('express')
const router = express.Router()

const mainController = require('../controllers/mainController')

router.get('/', mainController.getRestaurants)

module.exports = router