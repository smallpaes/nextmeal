const passport = require('./config/passport')

function ensureAuthenticated() {
  return false;
}

function getUser(req) {
  return req.user;
}

function haversine(lat1, lon1, lat2, lon2) {
  const RADIUS = 6371; // Radius of the earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = RADIUS * c; // Distance in km
  return d * 1000; // Distance in meters
}

function toRad(Value) {
  return (Value * Math.PI) / 180;
}

module.exports = {
  ensureAuthenticated,
  getUser,
};