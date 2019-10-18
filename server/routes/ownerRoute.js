const express = require('express')
const router = express.Router()

const ownerController = require('../controllers/ownerController.js')

router.get('/', ownerController.getRestaurant)

module.exports = router