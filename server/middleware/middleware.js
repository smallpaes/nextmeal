const { check } = require('express-validator');

let middleware = {
  valid: [
    check('name')
      .not().isEmpty().withMessage('name should be not empty'),
    check('description')
      .not().isEmpty().withMessage('description should be not empty'),
    check('image')
      .not().isEmpty().withMessage('image should be not empty'),
    check('tel')
      .not().isEmpty().withMessage('phone should be not empty'),
    check('address')
      .not().isEmpty().withMessage('address should be not empty')
  ],
}

module.exports = { valid } = middleware