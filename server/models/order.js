'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    UserId: DataTypes.STRING,
    order_date: DataTypes.DATE,
    require_date: DataTypes.STRING,
    order_status: DataTypes.STRING
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};