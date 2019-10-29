const express = require('express')
const router = express.Router()
const { validUserProfile, creatUser } = require('../middleware/middleware')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../controllers/userController.js')
const { ensureAuthenticated, getUser } = require('../config/auth')

router.get('/subscribe', ensureAuthenticated, getUser, userController.getSubscription)
router.post('/subscribe', ensureAuthenticated, getUser, userController.postSubscription)
router.post('/subscribe/spgateway/callback', userController.spgatewayCallback)

router.get('/:user_id', ensureAuthenticated, getUser, userController.getProfile)
router.put('/:user_id/edit', ensureAuthenticated, getUser, upload.single('avatar'), validUserProfile, userController.putProfile)

//user signup/signin related
router.get('/signup', userController.getCategories)
router.post('/emailcheck', creatUser, userController.emailCheck)
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

module.exports = router
