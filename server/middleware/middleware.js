const { check, validationResult } = require('express-validator')
const moment = require('moment')

const db = require('../models')
const Subscription = db.Subscription
const sequelize = require('sequelize')
const Op = sequelize.Op

let middleware = {
  validRestaurantForm: [
    check('name')
      .not().isEmpty().withMessage('name should be not empty'),
    check('description')
      .not().isEmpty().withMessage('description should be not empty'),
    check('tel')
      .not().isEmpty().withMessage('phone should be not empty'),
    check('address')
      .not().isEmpty().withMessage('address should be not empty')
  ],
  validMenuForm: [
    check('quantity')
      .not().isEmpty().withMessage('quantity should be not empty'),
  ],
  validDishForm: [
    check('name')
      .not().isEmpty().withMessage('name should be not empty'),
    check('description')
      .not().isEmpty().withMessage('description should be not empty'),
  ],
  validUserProfile: [
    check('name')
      .not().isEmpty().withMessage('name should be not empty'),
    check('email')
      .not().isEmpty().withMessage('email should be not empty'),
    check('location')
      .not().isEmpty().withMessage('location should be not empty'),
    check('address')
      .not().isEmpty().withMessage('address should be not empty'),
    check('dob')
      .not().isEmpty().withMessage('birthday should be not empty'),
    check('prefer')
      .not().isEmpty().withMessage('prefer should be not empty'),
  ],
  validOrderForm: [
    check('require_date')
      .not().isEmpty().withMessage('name should be not empty'),
    check('quantity')
      .not().isEmpty().withMessage('quantity should be not empty'),
  ],
  validMessage: (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 'error', errors: errors.array(), message: 'Information should be filled' });
    }
  },
  getTimeStop: (opening_hour, closing_hour) => {
    let array = []
    while (opening_hour < closing_hour) {
      array.push(new moment(opening_hour).format('HH:mm'))
      opening_hour.add(30, 'minute')
    }
    return array
  },
  validSubsribe: async (req, res, next) => {
    try {
      let start = moment().startOf('day').toDate()
      const subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: 1,
          sub_expired_date: { [Op.gte]: start },
        },
        order: [['sub_expired_date', 'DESC']],
        limit: 1
      })
      if (!subscription) return res.status(400).json({ status: 'error', message: 'You need to subscribe next meal now.' })
      next()
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = { validRestaurantForm, validMealForm, validMessage } = middleware

