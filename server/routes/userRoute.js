const express = require('express')
const router = express.Router()
const { validUserProfile } = require('../middleware/middleware')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/userController.js')

router.get('/subscribe', userController.getSubscription)
router.post('/subscribe', userController.postSubscription)
router.post('/subscribe/spgateway/callback', userController.spgatewayCallback)

router.get('/:user_id', userController.getProfile)
router.put('/:user_id/edit', upload.single('avatar'), validUserProfile, userController.putProfile)

module.exports = router