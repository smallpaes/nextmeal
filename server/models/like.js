'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Like.associate = function (models) {
    // associations can be defined here
    Like.belongsTo(models.User)
    Like.belongsTo(models.Restaurant)
  };
  return Like;
};