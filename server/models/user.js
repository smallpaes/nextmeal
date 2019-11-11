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
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    expired_date: DataTypes.DATE,
    geometry: DataTypes.GEOMETRY('POINT', 4326),
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Like, { onDelete: 'cascade', hooks: true })
    User.hasMany(models.Comment, { onDelete: 'cascade', hooks: true })
    User.hasMany(models.Subscription, { onDelete: 'cascade', hooks: true })
    User.hasMany(models.Order)
    User.hasOne(models.Restaurant)
  };
  return User;
};