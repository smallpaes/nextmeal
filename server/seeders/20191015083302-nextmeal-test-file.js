'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')
const locations = ['信義區', '大安區', '中山區', '松山區']
const categories = ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
const time_slots = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
const nowTime = new Date()
const tmr = new Date()
tmr.setDate(nowTime.getDate() + 1)
tmr.setHours(12, 0, 0, 0)

const Sequelize = require('sequelize')
module.exports = {
  up: (queryInterface, Sequelize) => {

    //add Users
    queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', 10),
      avatar: faker.image.avatar(),
      role: 'Admin',
      address: '台北市大安區臥龍街289-1號',
      latitude: '25.017186',
      longitude: '121.558462',
      geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.558462 25.017186)`),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', 10),
      avatar: faker.image.avatar(),
      role: 'user',
      address: '台北市大安區羅斯福路四段113巷',
      latitude: '25.011280',
      longitude: '121.538819',
      geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.538819 25.011280)`),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', 10),
      avatar: faker.image.avatar(),
      role: 'Owner',
      address: "台北市信義區松壽路8-10",
      latitude: '25.036037',
      longitude: '121.565124',
      geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.565124 25.036037)`),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', 10),
      avatar: faker.image.avatar(),
      role: 'Owner',
      address: "台北市信義區松壽路8-10",
      latitude: '25.036037',
      longitude: '121.565124',
      geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.565124 25.036037)`),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', 10),
      avatar: faker.image.avatar(),
      role: 'Owner',
      address: "台北市信義區松壽路8-10",
      latitude: '25.036037',
      longitude: '121.565124',
      geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.565124 25.036037)`),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user5',
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', 10),
      avatar: faker.image.avatar(),
      role: 'Owner',
      address: "台北市信義區松壽路8-10",
      latitude: '25.036037',
      longitude: '121.565124',
      geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.565124 25.036037)`),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])

    //add restaurants
    queryInterface.bulkInsert('Restaurants', [
      {
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: "台北市信義區松高路16號",
        opening_hour: '11:00',
        closing_hour: "14:00",
        image: faker.image.imageUrl(),
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        latitude: 25.038985,
        longitude: 121.567284,
        location: '信義區',
        geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.567284 25.038985)`),
        rating: parseFloat(Math.random() * 5).toFixed(1),
        CategoryId: Math.floor(Math.random() * 5) + 1,
        UserId: 3
      },
      {
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: "台北市信義區松壽路12號",
        opening_hour: '11:00',
        closing_hour: "14:00",
        image: faker.image.imageUrl(),
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        latitude: 25.036691,
        longitude: 121.566490,
        location: '信義區',
        geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.566490 25.036691)`),
        rating: parseFloat(Math.random() * 5).toFixed(1),
        CategoryId: Math.floor(Math.random() * 5) + 1,
        UserId: 4
      },
      {
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: "台北市大安區四維路96號",
        opening_hour: '11:00',
        closing_hour: "14:00",
        image: faker.image.imageUrl(),
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        latitude: 25.032872,
        longitude: 121.547953,
        location: '大安區',
        geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.547953 25.032872)`),
        rating: parseFloat(Math.random() * 5).toFixed(1),
        CategoryId: Math.floor(Math.random() * 5) + 1,
        UserId: 5
      },
      {
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: "台北市中山區中山北路二段44號",
        opening_hour: '11:00',
        closing_hour: "14:00",
        image: faker.image.imageUrl(),
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        latitude: 25.055176,
        longitude: 121.522471,
        location: '中山區',
        geometry: Sequelize.fn('ST_GeomFromText', `POINT(121.522471 25.055176)`),
        rating: parseFloat(Math.random() * 5).toFixed(1),
        CategoryId: Math.floor(Math.random() * 5) + 1,
        UserId: 6
      }
    ]
    );

    // add categories
    queryInterface.bulkInsert("Categories", categories.map((item, index) =>
      ({
        id: index + 1,
        name: item,
        image: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ), {});

    // add meals
    queryInterface.bulkInsert("Meals",
      Array.from({ length: 4 }).map((item, index) => (
        {
          name: faker.name.findName(),
          image: faker.image.imageUrl(),
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
    queryInterface.bulkInsert("Orders",
      Array.from({ length: 3 }).map((item, index) => (
        {
          UserId: Math.ceil(Math.random() * 2),
          order_date: new Date(),
          require_date: tmr,
          order_status: '明日',
          hasComment: Math.round(Math.random()),
          amount: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      , {});

    // add orderitems
    queryInterface.bulkInsert("Orderitems",
      Array.from({ length: 3 }).map((item, index) => (
        {
          OrderId: index + 1,
          MealId: Math.ceil(Math.random() * 4),
          quantity: Math.ceil(Math.random() * 3),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      , {});

    // add subscriptions
    return queryInterface.bulkInsert("Subscriptions",
      Array.from({ length: 6 }).map((item, index) => (
        {
          UserId: index + 1,
          sub_name: '輕量型',
          sub_price: 1000,
          sub_description: '一個月10餐',
          sub_balance: 10,
          sub_date: new Date(),
          sub_expired_date: new Date(nowTime.getTime() + (24 * 60 * 60 * 30 * 1000)),
          payment_status: Math.floor(Math.random() * 2),
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
    queryInterface.bulkDelete('Orderitems', null, { truncate: true })
    return queryInterface.bulkDelete('Restaurants', null, { truncate: true })
  }
};
