const express = require('express')
const router = express.Router()
const ownerController = require('../controllers/ownerController.js')
const { valid } = require('../middleware/middleware')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


router.get('/', ownerController.getRestaurant)
router.post('/', upload.single('image'), valid, ownerController.postRestaurant)
router.put('/', upload.single('image'), valid, ownerController.putRestaurant)

module.exports = router