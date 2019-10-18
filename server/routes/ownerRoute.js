const express = require('express')
const router = express.Router()
const ownerController = require('../controllers/ownerController.js')
const { validRestaurantForm, validMealForm } = require('../middleware/middleware')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


router.get('/', ownerController.getRestaurant)
router.post('/', upload.single('image'), validRestaurantForm, ownerController.postRestaurant)
router.put('/', upload.single('image'), validRestaurantForm, ownerController.putRestaurant)
router.get('/dishes', ownerController.getDishes)
router.post('/dishes', upload.single('image'), validMealForm, ownerController.postDish)

module.exports = router