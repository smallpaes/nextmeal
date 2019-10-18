const { check, validationResult } = require('express-validator')

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
  validMealForm: [
    check('name')
      .not().isEmpty().withMessage('name should be not empty'),
    check('description')
      .not().isEmpty().withMessage('description should be not empty'),
    check('quantity')
      .not().isEmpty().withMessage('quantity should be not empty'),
  ],
  validMessage: (req, res) => {
    console.log('message')
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 'error', errors: errors.array(), message: 'Information should be filled' });
    }
  }
}

module.exports = { validRestaurantForm, validMealForm, validMessage } = middleware