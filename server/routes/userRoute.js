const express = require('express')
const router = express.Router()
const { validUserProfile, validSubsribe } = require('../middleware/middleware')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const validator = require('../_helpers')
const userController = require('../controllers/userController.js')
const { ensureAuthenticated, isAuthAdmin, getUser } = require('../config/auth')

router.get('/subscribe', userController.getSubscription)
router.post('/subscribe', userController.postSubscription)
router.post('/subscribe/spgateway/callback', userController.spgatewayCallback)

//user signup/signin related
router.get('/signup', userController.getCategories)
router.post('/emailcheck', validator.creatUser, userController.emailCheck)
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

router.get('/orders', ensureAuthenticated, getUser, validSubsribe, userController.getOrders)
router.get('/orders/tomorrow', ensureAuthenticated, getUser, validSubsribe, userController.getTomorrow)

router.put('/:user_id/edit', ensureAuthenticated, getUser, upload.single('avatar'), validUserProfile, userController.putProfile)
router.get('/:user_id', ensureAuthenticated, getUser, userController.getProfile)

module.exports = router