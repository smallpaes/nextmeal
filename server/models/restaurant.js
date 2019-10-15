'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    tel: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    CategoryId: DataTypes.INTEGER,
    location: DataTypes.STRING,
    address: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    opening_hour: DataTypes.DATE,
    closing_hour: DataTypes.DATE,
    UserId: DataTypes.INTEGER
  }, {});
  Restaurant.associate = function (models) {
    // associations can be defined here
    Restaurant.hasMany(models.Like, { onDelete: 'cascade', hooks: true })
    Restaurant.hasMany(models.Meal, { onDelete: 'cascade', hooks: true })
    Restaurant.hasMany(models.Comment, { onDelete: 'cascade', hooks: true })
    Restaurant.belongsTo(models.Category)
    Restaurant.belongsTo(models.User)
  };
  return Restaurant;
};