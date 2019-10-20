const express = require('express')
const router = express.Router()

const mainController = require('../controllers/mainController')
const userController = require('../controllers/userController')

router.get('/', mainController.getRestaurants)
//user signup/signin related
router.get('/signup',userController.getCategories)
router.post('/emailcheck',userController.emailCheck)
router.post('/signup',userController.signUp)
router.post('/signin',userController.signIn)

module.exports = router