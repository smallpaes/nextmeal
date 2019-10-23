const passport = require('./config/passport')

const { check } = require('express-validator')

function ensureAuthenticated() {
  return false;
}

function getUser(req) {
  return req.user;
}

const creatUser = [check('email').isEmail()]
module.exports = {
  ensureAuthenticated,
  getUser,
  creatUser
};