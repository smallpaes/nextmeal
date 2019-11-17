const sequelize = require('sequelize')
const moment = require('moment')
const today = moment().toISOString()
let yesterday = moment().subtract(1, 'days').toISOString()
const start = moment().startOf('day').toISOString()
const end = moment().endOf('day').toISOString()
module.exports = {
  Comment: {
    RestaurantId: '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."RestaurantId" = "Restaurant"."id")'
  },
  Order: {
    UserId: '(SELECT COUNT(*) FROM "Orders" WHERE "Orders"."UserId" = "User"."id")'
  },
  char: {
    date: [sequelize.fn('to_char', sequelize.col('require_date'), 'YYMMDD'), 'date'],
    time: [sequelize.fn('to_char', sequelize.col('require_date'), 'HH24:MI'), 'time'],
    date_for_dashboard: [sequelize.fn('to_char', sequelize.col('require_date'), '%m/%d'), 'date'],
    date_for_admin_dashboard: [sequelize.fn('to_char', sequelize.col('createdAt'), '%m/%d'), 'date']
  },
  geo: {
    geometry: 'ST_DistanceSphere',
    random: 'random()'
  },
  literal: {
    name: [sequelize.literal('(SELECT name FROM "Users" WHERE "Users"."id" = "Comment"."UserId")'), 'name'],
    subscribeUsers: function (now) {
      return [sequelize.literal(`(SELECT COUNT(*) FROM "Users" WHERE "Users"."expired_date" > '${now}')`), 'subscribeUsers']
    },
    nonsubscribeUsers: function (now) {
      return [sequelize.literal(`(SELECT COUNT(*) FROM "Users" WHERE "Users"."expired_date" < '${now}' OR "Users"."expired_date" IS NULL)`), 'nonsubscribeUsers']
    },
    userIncreased: function (end, start) {
      return [sequelize.literal(`(SELECT COUNT(*) FROM "Users" WHERE "Users"."createdAt" < '${end}')-(SELECT COUNT(*) FROM "Users" WHERE "Users"."createdAt" < '${start}')`), 'userIncreased']
    },
    restIncreased: function (end, start) {
      return [sequelize.literal(`(SELECT COUNT(*) FROM "Restaurants" WHERE "Restaurants"."createdAt" < '${end}')-(SELECT COUNT(*) FROM "Restaurants" WHERE "Restaurants"."createdAt" < '${start}')`), 'restIncreased']
    },
    subtIncreased: function (end, start) {
      return [sequelize.literal(`(SELECT COUNT(*) FROM "Subscriptions" WHERE "Subscriptions"."createdAt" < '${end}')-(SELECT COUNT(*) FROM "Subscriptions" WHERE "Subscriptions"."createdAt" < '${start}')`), 'subtIncreased']
    },
    todayOrders: function (start, end) {
      return [sequelize.literal(`(SELECT COUNT(*) FROM "Orders" WHERE "Orders"."require_date" > '${start}' AND "Orders"."require_date" < '${end}')`), 'todayOrders']
    }
  }
}