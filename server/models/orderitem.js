'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    OrderId: DataTypes.INTEGER,
    MealId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  OrderItem.associate = function(models) {
    // associations can be defined here
  };
  return OrderItem;
};