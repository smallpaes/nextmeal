'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    SubscriptionId: DataTypes.INTEGER,
    params: DataTypes.TEXT,
    amount: DataTypes.INTEGER,
    paidAt: DataTypes.DATE
  }, {});
  Payment.associate = function(models) {
    // associations can be defined here
  };
  return Payment;
};