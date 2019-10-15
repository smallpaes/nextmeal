'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    avatar: DataTypes.STRING,
    prefer: DataTypes.STRING,
    dob: DataTypes.DATE,
    modifiedAt: DataTypes.DATE,
    location: DataTypes.STRING,
    address: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};