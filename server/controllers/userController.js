const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User
const Subscription = db.Subscription
const Payment = db.Payment
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Category = db.Category

const fetch = require('node-fetch')

// import express-validator for validation
const { validationResult } = require('express-validator/check');

module.exports = {
  emailCheck: async (req, res) => {
    try {
      //check if email has been used
      const { email } = req.body
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ status: 'error', message: 'invalid Email format' });
      }
      const user = await User.findOne({ where: { email } })
      //if user exsist , return error
      if (user) {
        return res.status(400).json({ status: 'error', message: 'Email has been used' })
      }
      //otherwise return success
      return res.status(200).json({ status: 'success', message: 'Valid email' })
    } catch (error) {
      res.json({ status: 'error', message: error })
    }


  },
  signUp: async (req, res) => {
    // check for empty input
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.passwordCheck || !req.body.dob || !req.body.prefer || !req.body.address) {
      return res.json({ status: 'error', message: 'All fields are required' })
    }
    // check if password length is between 8-12
    if (req.body.password.length < 8 || req.body.password.length > 12) {
      return res.json({ status: 'error', message: 'Password should be between 8-12' })
    }
    // validate password
    if (req.body.password !== req.body.passwordCheck) {
      return res.json({ status: 'error', message: 'Two passwords do not match' })
    }

    try {
      // get lat & lng from address
      const geoCodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json' + '?' + `address=${req.body.address}&key=${process.env.API_KEY}`
      const response = await fetch(encodeURI(geoCodingUrl));
      const data = await response.json()
      const { lat, lng } = data.results[0].geometry.location
      const location = data.results[0].address_components[2].long_name

      // create user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        role: 'User',
        dob: req.body.dob,
        prefer: req.body.prefer,
        address: req.body.address,
        latitude: lat,
        longitude: lng,
        location
      })

      // check if the user has valid subscriptions
      const validSubscriptions = await user.getSubscriptions({ where: { payment_status: true, sub_expired_date: { [Op.gte]: new Date() } } })
      const subscription_status = validSubscriptions.length >= 1 ? true : false

      //generate a token for the user
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'NextmealProject')

      return res.json({
        status: 'success', message: 'Successfully sign up', user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          subscription_status
        }, token
      })
    } catch (error) {
      res.json({ status: 'error', message: error })
    }
  },
  signIn: async (req, res) => {
    try {
      // check for empty field
      if (!req.body.email || !req.body.password) {
        return res.json({ status: 'error', message: 'Email and password are required' })
      }
      // check if user exists and password is correct
      const { email: userName, password: password } = req.body
      const user = await User.findOne({
        where: { email: userName }
      })
      if (!user) return res.status(401).json({ status: 'error', message: 'User does not exist' })

      // check if the user has valid subscriptions
      const validSubscriptions = await user.getSubscriptions({ where: { payment_status: true, sub_expired_date: { [Op.gte]: new Date() } } })
      const subscription_status = validSubscriptions.length >= 1 ? true : false


      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      // generate and provide user with a token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'NextmealProject')
      return res.json({
        status: 'success', message: 'Successfully log in', token,
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          subscription_status
        }
      })

    } catch (error) {
      res.json({ status: 'error', message: error })
    }

  },
  getCategories: async (req, res) => {
    const categories = await Category.findAll()
    const category = categories.map(item => item.name)
    return res.json({ category })
  }

}