'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    UserId: DataTypes.STRING,
    order_date: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    require_date: DataTypes.DATE,
    order_status: {
      type: DataTypes.STRING,
      defaultValue: '明日'
    },
    amount: DataTypes.FLOAT,
    hasComment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Order.associate = function (models) {
    // associations can be defined here
    Order.belongsTo(models.User)
    Order.belongsToMany(models.Meal, {
      as: "meals",
      through: {
        model: models.OrderItem,
        unique: false
      },
      foreignKey: "OrderId"
    })
  };
  return Order;
};