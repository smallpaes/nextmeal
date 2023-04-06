const passport = require('./config/passport')
const ImageKit = require('imagekit')

function ensureAuthenticated() {
  return false;
}

function getUser(req) {
  return req.user;
}

function haversine(lat1, lon1, lat2, lon2) {
  const RADIUS = 6371; // Radius of the earth in km
  const dLat = _toRad(lat2 - lat1);
  const dLon = _toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(_toRad(lat1)) *
      Math.cos(_toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = RADIUS * c; // Distance in km
  return d * 1000; // Distance in meters
}

function _toRad(value) {
  return (value * Math.PI) / 180;
}

const imagekit = new ImageKit({
  publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
})

const uploadImage = async (file, fileName, folder) => {
  return imagekit.upload({ file, fileName, folder });
}

const getImageRelativePath = fullPath => {
  return fullPath.replace(process.env.IMAGEKIT_URL_ENDPOINT, '');
}

module.exports = {
  ensureAuthenticated,
  getUser,
  haversine,
  imagekit,
  uploadImage,
  getImageRelativePath
};