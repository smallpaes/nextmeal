module.exports = {
  Comment: {
    RestaurantId: '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."RestaurantId" = "Restaurant"."id")'
  }
}