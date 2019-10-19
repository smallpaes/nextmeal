const { ensureAuthenticated, isAuthAdmin, getUser } = require('../config/auth')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Meal = db.Meal
const Order = db.Order
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = (app) => {
  app.get('/api', (req, res) => {
    console.log(req.query);
    res.json({ data: 'Testing Data' })
  })
}