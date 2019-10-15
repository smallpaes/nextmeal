'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    UserId: DataTypes.INTEGER,
    sub_name: DataTypes.STRING,
    sub_price: DataTypes.FLOAT,
    sub_description: DataTypes.TEXT,
    sub_date: DataTypes.DATE,
    sub_expired_date: DataTypes.DATE,
    payment_status: DataTypes.STRING,
    sub_balance: DataTypes.FLOAT
  }, {});
  Subscription.associate = function (models) {
    // associations can be defined here
    Subscription.belongsTo(models.User)
    Subscription.hasMany(models.Payment)
  };
  return Subscription;
};