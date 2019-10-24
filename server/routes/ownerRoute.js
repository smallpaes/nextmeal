const express = require('express')
const router = express.Router()
const ownerController = require('../controllers/ownerController.js')
const { validRestaurantForm, validMenuForm, validDishForm } = require('../middleware/middleware')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// owner restaurant
router.get('/', ownerController.getRestaurant)
router.post('/', upload.single('image'), validRestaurantForm, ownerController.postRestaurant)
router.put('/', upload.single('image'), validRestaurantForm, ownerController.putRestaurant)

// owner dish
router.get('/dishes', ownerController.getDishes)
router.post('/dishes', upload.single('image'), validDishForm, ownerController.postDish)
router.get('/dishes/:dish_id', ownerController.getDish)
router.put('/dishes/:dish_id/edit', upload.single('image'), validDishForm, ownerController.putDish)
router.delete('/dishes/:dish_id', ownerController.deleteDish)

// owner meun
router.get('/menu', ownerController.getMenu)
router.put('/menu', validMenuForm, ownerController.putMenu)

router.get('/orders', ownerController.getOrders)

module.exports = router