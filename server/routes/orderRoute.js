const express = require('express')
const router = express.Router()
const { validOrderForm, validComment, validMessage, stopOrder } = require('../middleware/middleware.js')
const orderController = require('../controllers/orderController.js')
const multer = require('multer')
const upload = multer()

router.get('/new', orderController.getNew) //瀏覽新增一筆訂購餐點的表單
router.post('/new', stopOrder, validOrderForm, validMessage, orderController.postNew)

router.get('/:order_id/comment', orderController.getComment)
router.post('/:order_id/comment', upload.single('image'), validComment, validMessage, orderController.postComment)

router.get('/:order_id/edit', orderController.getOrderEdit)
router.get('/:order_id', orderController.getOrder)

router.put('/:order_id/cancel', stopOrder, orderController.putCancel)
router.put('/:order_id', stopOrder, validOrderForm, validMessage, orderController.putOrder)

module.exports = router