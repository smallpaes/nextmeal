const express = require('express')
const router = express.Router()
const { validUserProfile, creatUser, validSubsribe, validMessage } = require('../middleware/middleware')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../controllers/userController.js')
const { ensureAuthenticated, getUser } = require('../config/auth')

router.get('/subscribe', ensureAuthenticated, getUser, userController.getSubscription)
router.post('/subscribe', ensureAuthenticated, getUser, userController.postSubscription)
router.post('/subscribe/spgateway/callback', userController.spgatewayCallback)

//user signup/signin related
router.get('/signup', userController.getCategories)
router.post('/emailcheck', creatUser, validMessage, userController.emailCheck)
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

router.get('/orders', ensureAuthenticated, getUser, userController.getOrders)
router.get('/orders/tomorrow', ensureAuthenticated, getUser, validSubsribe, userController.getTomorrow)

router.put('/:user_id/edit', ensureAuthenticated, getUser, upload.single('avatar'), validUserProfile, validMessage, userController.putProfile)
router.get('/current_user', ensureAuthenticated, getUser, userController.getCurrentUser)
router.get('/:user_id', ensureAuthenticated, getUser, userController.getProfile)
module.exports = router