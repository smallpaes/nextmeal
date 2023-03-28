const express = require('express')
const router = express.Router()
const locationController = require('../controllers/locationController.js')

router.get('/validate', locationController.validateLocation)

module.exports = router