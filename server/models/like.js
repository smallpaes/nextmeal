'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    // associations can be defined here
  };
  return Like;
};