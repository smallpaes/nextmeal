const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController.js')

router.get('/subscribe', userController.getSubscription)
router.post('/subscribe', userController.postSubscription)
// router.post('/subscribe/spgateway/callback', userController.spgatewayCallback)

module.exports = router