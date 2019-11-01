'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      sub_name: {
        type: Sequelize.STRING
      },
      sub_price: {
        type: Sequelize.FLOAT
      },
      sub_description: {
        type: Sequelize.TEXT
      },
      sub_date: {
        type: Sequelize.DATE
      },
      sub_expired_date: {
        type: Sequelize.DATE
      },
      payment_status: {
        type: Sequelize.BOOLEAN,
      },
      sn: {
        type: Sequelize.STRING
      },
      sub_balance: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Subscriptions');
  }
};