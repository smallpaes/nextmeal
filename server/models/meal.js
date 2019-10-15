'use strict';
module.exports = (sequelize, DataTypes) => {
  const Meal = sequelize.define('Meal', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
    modifiedAt: DataTypes.DATE,
    isServing: DataTypes.BOOLEAN,
    nextServing: DataTypes.BOOLEAN
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