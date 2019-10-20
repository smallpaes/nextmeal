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
  validMenuForm: [
    check('name')
      .not().isEmpty().withMessage('name should be not empty'),
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
      .not().isEmpty().withMessage('birthday should be not empty'),
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