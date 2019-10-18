const express = require('express')
const router = express.Router()
const { validRestaurantForm } = require('../middleware/middleware')
const adminController = require('../controllers/adminController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/:restaurant_id', adminController.getRestaurant)
router.put('/restaurants/:restaurant_id', upload.single('image'), validRestaurantForm, adminController.putRestaurant)
router.delete('/restaurants/:restaurant_id', adminController.deleteRestaurant)

module.exports = router