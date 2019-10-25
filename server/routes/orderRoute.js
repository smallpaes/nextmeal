const express = require('express')
const router = express.Router()
const { validOrderForm } = require('../middleware/middleware.js')
const orderController = require('../controllers/orderController.js')


router.get('/:order_id/comment', orderController.getComment)
router.put('/:order_id/cancel', orderController.putCancel)
router.get('/:order_id/edit', orderController.getOrderEdit)
router.get('/:order_id', orderController.getOrder)
router.put('/:order_id', validOrderForm, orderController.putOrder)
module.exports = router