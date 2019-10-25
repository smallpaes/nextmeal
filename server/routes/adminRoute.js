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

router.get('/users', adminController.getUsers)
router.get('/users/:user_id', adminController.getUser)
router.delete('/users/:user_id', adminController.deleteUser)

router.get('/orders', adminController.getOrders)
// router.get('/orders/:order_id', adminController.getOrder)
router.put('/orders/:order_id', adminController.putOrder) // admin 取消訂單使用，沒有編輯功能!

module.exports = router