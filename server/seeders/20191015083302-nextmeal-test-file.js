'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')
const locations = ['信義區', '大安區', '中山區', '松山區']
const categories = ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
const nowTime = new Date()
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])

    //add restaurants
    queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 4 }).map((d, index) =>
        ({
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hour: '11:00',
          closing_hour: "14:00",
          image: faker.image.imageUrl(),
          description: faker.lorem.text(),
          location: locations[Math.floor(Math.random() * 3) + 1],
          createdAt: new Date(),
          updatedAt: new Date(),
          rating: parseFloat(Math.random() * 5).toFixed(1),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
          CategoryId: Math.floor(Math.random() * 5) + 1,
          UserId: index + 3
        })
      ), {});

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
    return queryInterface.bulkInsert("Orders",
    Array.from({ length: 3 }).map((item, index) => (
      {
        UserId: Math.ceil(Math.random()*2),
        order_date:new Date(),
        require_date:new Date(nowTime.getTime()+(24*60*60*1000)),
        order_status:'prepared',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    , {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, { truncate: true })
    queryInterface.bulkDelete('Categories', null, { truncate: true })
    queryInterface.bulkDelete('Meals', null, { truncate: true }),
    queryInterface.bulkDelete('Orders', null, { truncate: true })
    return queryInterface.bulkDelete('Restaurants', null, { truncate: true })
  }
};
