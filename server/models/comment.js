'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    user_text: DataTypes.STRING,
    res_text: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
  };
  return Comment;
};