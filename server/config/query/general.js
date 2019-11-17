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
    time: [sequelize.fn('date_format', sequelize.col('require_date'), '%H:%i'), 'time'],
    date_for_dashboard: [sequelize.fn('DATE_FORMAT', sequelize.col('require_date'), '%m/%e'), 'date']
  },
  geo: {
    geometry: 'ST_Distance_Sphere',
    random: 'rand()'
  },
  literal: {
    name: [sequelize.literal('(SELECT name FROM Users WHERE Users.id = Comment.UserId)'), 'name']
  }
}