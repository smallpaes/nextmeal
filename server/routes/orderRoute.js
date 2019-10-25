const express = require('express')
const router = express.Router()
const { validOrderForm } = require('../middleware/middleware.js')
const orderController = require('../controllers/orderController.js')


router.get('/:order_id/comment', orderController.getComment)
router.get('/:order_id', orderController.getOrder)
router.get('/:order_id/edit', orderController.getOrderEdit)
router.put('/:order_id', validOrderForm, orderController.putOrder) // 之後要記得加上 validOrderForm

module.exports = router