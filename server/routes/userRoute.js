const express = require('express')
const router = express.Router()
const validator = require('../_helpers')
const userController = require('../controllers/userController')
//user signup/signin related
router.get('/signup', userController.getCategories)
router.post('/emailcheck', validator.creatUser, userController.emailCheck)
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

module.exports = router