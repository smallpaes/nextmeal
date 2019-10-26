const express = require('express')
const router = express.Router()
const { validOrderForm } = require('../middleware/middleware.js')
const orderController = require('../controllers/orderController.js')


router.get('/new', orderController.getNew) //瀏覽新增一筆訂購餐點的表單
router.post('/new', orderController.postNew)

router.get('/:order_id/comment', orderController.getComment)
router.get('/:order_id/edit', orderController.getOrderEdit)
router.get('/:order_id', orderController.getOrder)

router.put('/:order_id/cancel', orderController.putCancel)
router.put('/:order_id', validOrderForm, orderController.putOrder)

module.exports = router