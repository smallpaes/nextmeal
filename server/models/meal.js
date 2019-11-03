'use strict';
module.exports = (sequelize, DataTypes) => {
  const Meal = sequelize.define('Meal', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    nextServing_quantity: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
    modifiedAt: DataTypes.DATE,
    isServing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    nextServing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Meal.associate = function (models) {
    // associations can be defined here
    Meal.belongsTo(models.Restaurant)
    Meal.belongsToMany(models.Order, {
      as: "orders",
      through: {
        model: models.OrderItem,
        unique: false
      },
      foreignKey: "MealId"
    })
  };
  return Meal;
};