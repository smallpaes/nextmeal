'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const opening_hour = '11:00'
const closing_hour = '14:00'
const users = require('../location/users.json')
const stores = require('../location/stores.json')
const foodImg = require('../location/foodImg.json')
const restImg = require('../location/restImg.json')
const categories = require('../location/categories.json')
const userComment = require('../location/comment.json')
function createUsers(users) {
  let userData = []
  for (let i = 0; i < users.length; i++) {
    let role = 'User'
    if (i === 0) role = 'Admin'
    if (i > 1 && i < (stores.length + 2)) role = 'Owner'
    const seedUser = {
      name: i === 0 ? 'root' : faker.name.findName(),
      email: i === 0 ? 'root@example.com' : `user${i}@example.com`,
      password: bcrypt.hashSync('12345678', 10),
      avatar: `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70 + 1)}`,
      role: role,
      dob: faker.date.past(60, new Date(2001, 0, 1)),
      location: users[i].location,
      prefer: categories[Math.floor(Math.random() * 5) + 1].name,
      address: users[i].address,
      lat: users[i].lat,
      lng: users[i].lng,
      geometry: Sequelize.fn('ST_GeomFromText', `POINT(${users[i].lng} ${users[i].lat})`),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    userData.push(seedUser)
  }
  return userData
}

function createRest(store) {
  let restData = []
  for (let i = 0; i < store.length; i++) {
    const seedRest = {
      name: store[i].name,
      description: store[i].description.substring(0, 101),
      tel: faker.phone.phoneNumber(),
      location: store[i].location,
      address: store[i].address,
      UserId: i + 3,
      opening_hour: opening_hour,
      closing_hour: closing_hour,
      CategoryId: Math.floor(Math.random() * 7) + 1,
      image: restImg[Math.floor(Math.random() * restImg.length)],
      lat: store[i].lat,
      lng: store[i].lng,
      geometry: Sequelize.fn('ST_GeomFromText', `POINT(${store[i].lng} ${store[i].lat})`),
      rating: parseFloat(Math.random() * 4 + 1).toFixed(1),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    restData.push(seedRest)
  }
  return restData
}

function randomTime(num) {
  let tomorrow = moment().add(num, 'days').startOf('day')
  tomorrow.set('Hour', (Math.floor(Math.random() * 3) + 11)).set('minute', ((Math.random() > 0.5) ? 0 : 30))
  tomorrow = new Date(tomorrow)
  return tomorrow
}

function pastOrder() {
  let date = faker.date.past(1, new Date(Date.now()))
  date = moment(date).startOf('day')
  date.set('Hour', (Math.floor(Math.random() * 3) + 11)).set('minute', ((Math.random() > 0.5) ? 0 : 30)).toDate()
  date = new Date(date)
  return date
}

function orderThing(start, end) {
  let usersOrders = []
  let OrdersItem = []
  let commentRest = []
  for (let i = start; i < end; i++) {
    let past = pastOrder()
    let order_status = '今日'
    let hasComment = true
    let userId, orderPast, user_text
    let orderMeal = Math.ceil(Math.random() * (stores.length - 150)) + 2
    const random = Math.floor(Math.random() * 3) + 1
    if (i < 120) {
      userId = Math.ceil(Math.random() * (users.length - stores.length + 2)) + stores.length + 2
      user_text = userComment[Math.floor(Math.random() * userComment.length)]
    }
    // id 2 使用者歷史
    if (i > 119 && i < 151) userId = 2, user_text = userComment[Math.floor(Math.random() * userComment.length)]
    // id 1 餐廳歷史
    if (i > 150 && i < 170) {
      userId = Math.ceil(Math.random() * (users.length - stores.length + 2)) + stores.length + 2
      orderMeal = 1
      user_text = userComment[Math.floor(Math.random() * userComment.length)]
    }
    if (i === 170) {
      userId = 2
      order_status = '取消'
      hasComment = false
      past = randomTime(0)
    }
    if (i > 170) {
      userId = 2
      order_status = '取消'
      hasComment = false
    }
    if (i === 190) {
      userId = 2
      past = randomTime(1)
      order_status = '明日'
      hasComment = false
    }
    // id 1 餐廳今日
    if (i > 190) {
      userId = Math.ceil(Math.random() * (users.length - stores.length + 2)) + stores.length + 2
      orderMeal = 1
      past = randomTime(0)
      order_status = '今日'
      hasComment = false
    }
    orderPast = new Date(moment(past).subtract(1, 'days'))
    const seedOrders = {
      UserId: userId,
      require_date: past,
      order_date: orderPast,
      order_status: order_status,
      hasComment: hasComment,
      amount: random,
      createdAt: past,
      updatedAt: past
    }
    const seedOrderItem = {
      OrderId: i + 1,
      MealId: orderMeal,
      quantity: random,
      createdAt: past,
      updatedAt: past
    }
    if (i < 158) {
      const seedComment = {
        UserId: userId,
        user_text: user_text,
        rating: Math.floor(Math.random() * 5 + 1),
        RestaurantId: orderMeal,
        createdAt: past,
        updatedAt: past
      }
      commentRest.push(seedComment)
    }
    usersOrders.push(seedOrders)
    OrdersItem.push(seedOrderItem)
  }
  return { usersOrders, OrdersItem, commentRest }
}
const Sequelize = require('sequelize')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let allUser = createUsers(users)
    let allStore = createRest(stores)
    //add Users
    await queryInterface.bulkInsert('Users', allUser, {})

    //add restaurants
    await queryInterface.bulkInsert('Restaurants', allStore, {});

    // add categories
    await queryInterface.bulkInsert("Categories", categories.map((item, index) =>
      ({
        id: index + 1,
        name: item.name,
        image: item.image,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ), {});

    // add meals
    await queryInterface.bulkInsert("Meals",
      Array.from({ length: stores.length }).map((item, index) => (
        {
          name: faker.name.findName(),
          image: foodImg[Math.floor(Math.random() * foodImg.length)],
          RestaurantId: index + 1,
          quantity: 50,
          description: faker.lorem.text(),
          isServing: true,
          nextServing: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      , {});

    // add orders
    const { usersOrders, OrdersItem, commentRest } = orderThing(0, 300)

    await queryInterface.bulkInsert("Orders", usersOrders, {});
    // add orderitems
    await queryInterface.bulkInsert("OrderItems", OrdersItem, {});
    await queryInterface.bulkInsert("Comments", commentRest, {});
    // add subscriptions
    return queryInterface.bulkInsert("Subscriptions",
      Array.from({ length: users.length - stores.length + 1}).map((item, index) => (
        {
          UserId: index < 3 ? index + 1 : index + stores.length,
          sub_name: '輕量型',
          sub_price: 1000,
          sub_description: '一個月10餐',
          sub_balance: 10,
          sub_date: new Date(),
          sub_expired_date: moment().add(30, 'days').endOf('day').toDate(),
          payment_status: true,
          sn: Date.now() + index,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      , {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, { truncate: true })
    queryInterface.bulkDelete('Categories', null, { truncate: true })
    queryInterface.bulkDelete('Meals', null, { truncate: true })
    queryInterface.bulkDelete('Subscriptions', null, { truncate: true })
    queryInterface.bulkDelete('Orders', null, { truncate: true })
    queryInterface.bulkDelete('OrderItems', null, { truncate: true })
    queryInterface.bulkDelete('Comments', null, { truncate: true })
    return queryInterface.bulkDelete('Restaurants', null, { truncate: true })
  }
};
