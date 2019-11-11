const sequelize = require('sequelize')

module.exports = {
  Comment: {
    RestaurantId: '(SELECT COUNT(*) FROM Comments WHERE Comments.RestaurantId = Restaurant.id)'
  },
  Order: {
    UserId: '(SELECT COUNT(*) FROM Orders WHERE Orders.UserId = User.id)'
  },
  char: {
    date: [sequelize.fn('date_format', sequelize.col('require_date'), '%Y%c%d'), 'date'],
    time: [sequelize.fn('date_format', sequelize.col('require_date'), '%H:%i'), 'time']
  },
  geo: {
    geometry: 'ST_Distance_Sphere',
    random: 'rand()'
  }
}