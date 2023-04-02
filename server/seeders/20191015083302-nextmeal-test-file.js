'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')
const moment = require('moment-timezone')
const opening_hour = '11:00'
const closing_hour = '14:00'
const sequelize = require('sequelize')
const users = require('../location/users.json')
const stores = require('../location/stores.json')
const foodImg = require('../location/foodImg.json')
const restImg = require('../location/restImg.json')
const categories = require('../location/categories.json')
const userComment = require('../location/comment.json')
faker.locale = 'zh_TW';
function randomPhone(num) {
  let random = ''
  for (let i = 0; i < num; i++) {
    let ramdomNum = Math.floor(Math.random() * 10)
    random += ramdomNum
  }
  return random
}

const today = moment().toDate()
const pass_month = moment().subtract(1, 'months').toDate()

function createUsers(users) {
  let userData = []
  for (let i = 0; i < users.length; i++) {
    let role = 'User'
    let expired_date = moment().add(30, 'days').endOf('day').toDate()
    if (i === 0) {
      role = 'Admin'
      expired_date = null
    }
    if (i > 1 && i < (stores.length + 2)) {
      role = 'Owner'
      expired_date = null
    }

    if (i > 3 & i < 318) expired_date = null
    const seedUser = {
      id: i + 1,
      name: i === 0 ? 'root' : faker.fake("{{name.firstName}}{{name.lastName}}"),
      email: i === 0 ? 'root@example.com' : `user${i}@example.com`,
      password: bcrypt.hashSync('Nextmeal!', 10),
      avatar: `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70 + 1)}`,
      role: role,
      dob: faker.date.past(60, new Date(2001, 0, 1)),
      location: users[i].location,
      prefer: categories[Math.floor(Math.random() * 5) + 1].name,
      address: users[i].address,
      lat: users[i].lat,
      lng: users[i].lng,
      geometry: sequelize.fn('ST_GeomFromText', `POINT(${users[i].lng} ${users[i].lat})`),
      createdAt: faker.date.between(pass_month, today),
      updatedAt: today,
      expired_date: expired_date
    }
    userData.push(seedUser)
  }
  return userData
}

function createRest(store) {
  let restData = []
  for (let i = 0; i < store.length; i++) {
    const seedRest = {
      id: i + 1,
      name: store[i].name.length > 30 ? store[i].name.slice(30) : store[i].name,
      description: store[i].description.substring(0, 300),
      tel: `02-${randomPhone(4)}-${randomPhone(4)}`,
      location: store[i].location,
      address: store[i].address,
      UserId: i + 3,
      opening_hour: opening_hour,
      closing_hour: closing_hour,
      CategoryId: Math.floor(Math.random() * 7) + 1,
      image: restImg[Math.floor(Math.random() * restImg.length)],
      lat: store[i].lat,
      lng: store[i].lng,
      geometry: sequelize.fn('ST_GeomFromText', `POINT(${store[i].lng} ${store[i].lat})`),
      rating: parseFloat(Math.random() * 4 + 1).toFixed(1),
      createdAt: faker.date.between(pass_month, today),
      updatedAt: today
    }
    restData.push(seedRest)
  }
  return restData
}

function creatMeal(stores) {
  let mealData = []
  for (let i = 0; i < stores.length; i++) {
    let random = Math.floor(Math.random() * foodImg.length)
    const seedMeal = {
      id: i + 1,
      name: foodImg[random].name.length > 30 ? foodImg[random].name.slice(30) : foodImg[random].name,
      image: foodImg[random].image,
      RestaurantId: i + 1,
      quantity: 50,
      description: foodImg[random].description,
      isServing: true,
      nextServing: false,
      isDeleted: false,
      createdAt: today,
      updatedAt: today
    }
    mealData.push(seedMeal)
  }
  return mealData
}

function randomTime(num) {
  let tomorrow = moment().add(num, 'days').startOf('day')
  tomorrow.set('Hour', (Math.floor(Math.random() * 3) + 11)).set('minute', ((Math.random() > 0.5) ? 0 : 30))
  return tomorrow.toDate()
}

function pastOrder() {
  let date = faker.date.past(1, today)
  date = moment(date).startOf('day')
  date.set('Hour', (Math.floor(Math.random() * 3) + 11)).set('minute', ((Math.random() > 0.5) ? 0 : 30)).toDate()
  return date.toDate()
}

function randomOrder() {
  let randomDate = faker.date.between(pass_month, today)
  let tomorrow = moment(randomDate).startOf('day')
  tomorrow.set('Hour', (Math.floor(Math.random() * 3) + 11)).set('minute', ((Math.random() > 0.5) ? 0 : 30))
  return tomorrow.toDate()
}

function orderThing(start, end) {
  let usersOrders = []
  let OrdersItem = []
  let commentRest = []
  for (let i = start; i < end; i++) {
    let past = pastOrder()
    let order_status = '今日'
    let hasComment = false
    let userId, orderPast, user_text
    let orderMeal = Math.ceil(Math.random() * (stores.length - 150)) + 2
    const random = Math.floor(Math.random() * 3) + 1
    if (i < 120) {
      userId = Math.ceil(Math.random() * (users.length - stores.length)) + stores.length
      user_text = userComment[Math.floor(Math.random() * userComment.length)]
    }
    // id 2 使用者歷史
    if (i > 119 && i < 151) userId = 2, user_text = userComment[Math.floor(Math.random() * userComment.length)]
    // id 1 餐廳歷史
    if (i > 150 && i < 170) {
      userId = Math.ceil(Math.random() * (users.length - stores.length)) + stores.length
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
      userId = Math.ceil(Math.random() * (users.length - stores.length)) + stores.length
      orderMeal = 1
      past = randomTime(0)
      order_status = '今日'
      hasComment = false
    }
    if (i > 195) {
      userId = Math.ceil(Math.random() * (users.length - stores.length)) + stores.length
      orderMeal = 1
      past = randomOrder()
      order_status = '今日'
      hasComment = false
    }
    orderPast = moment(past).subtract(1, 'days').toDate()
    const seedOrders = {
      id: i + 1,
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
      id: i + 1,
      OrderId: i + 1,
      MealId: orderMeal,
      quantity: random,
      createdAt: past,
      updatedAt: past
    }
    if (i < 158) {
      const seedComment = {
        id: i + 1,
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
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const allUser = createUsers(users)
    const allStore = createRest(stores)
    const allMeal = creatMeal(stores)
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
        createdAt: today,
        updatedAt: today
      })
    ), {});

    // add meals
    await queryInterface.bulkInsert("Meals", allMeal, {});

    // add orders
    const { usersOrders, OrdersItem, commentRest } = orderThing(0, 300)

    await queryInterface.bulkInsert("Orders", usersOrders, {});
    // add orderitems
    await queryInterface.bulkInsert("OrderItems", OrdersItem, {});
    await queryInterface.bulkInsert("Comments", commentRest, {});
    // add subscriptions
    return queryInterface.bulkInsert("Subscriptions",
      Array.from({ length: users.length - stores.length - 1 }).map((item, index) => (
        {
          id: index + 1,
          UserId: index === 0 ? index + 2 : index + stores.length + 2,
          sub_name: index > 90 ? '輕量型' : '滿足型',
          sub_price: index > 90 ? 1000 : 2000,
          sub_description: index > 90 ? '一個月10餐' : '一個月20餐',
          sub_balance: index > 90 ? 10 : 20,
          sub_date: faker.date.between(pass_month, today),
          sub_expired_date: moment().add(30, 'days').endOf('day').toDate(),
          payment_status: true,
          sn: Date.today() + index,
          createdAt: faker.date.between(pass_month, today),
          updatedAt: today
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
