const passport = require('./config/passport')

function ensureAuthenticated() {
  return false;
}

function getUser(req) {
  return req.user;
}

module.exports = {
  ensureAuthenticated,
  getUser,
};