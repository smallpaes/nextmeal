var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;
var app = require('../../../app')
var helpers = require('../../../_helpers');
const db = require('../../../models')
const moment = require('moment')
const nowTime = new Date()
const tmr = moment(nowTime, "YYYY-M-D H:m").add(1, 'day').set({ hour: 12, minute: 0 }).toDate()
// tmr.setDate(nowTime.getDate() + 1)
// tmr.setHours(12, 0, 0, 0)
const content = encodeURIComponent('大安區')
const defaultRestaurant1 = {
  name: "Danny的小餐館",
  rating: 4.8,
  location: "大安區",
  address: "台北市大安區臥龍街289號",
  lat: '25.017186',
  lng: '121.558462',
  description: '一家還不錯的店',
  image: 'https://randomuser.me/api/portraits/lego/1.jpg',
  UserId: 1,
  CategoryId: 1
}

describe('# Admin::Restaurant request', () => {

  context('go to admin restaurant page', () => {

    describe('if user not log in', () => {

      before(async (done) => {
        done()
      })
      it('should get Unauthorized', (done) => {
        request(app)
          .get('/api/admin/restaurants')
          .expect(401)
          .end((err, res) => {
            if (err) { return done(err) }
            res.text.should.include('Unauthorized')
            done()
          })
      })
    })

    describe('if normal user logs in', () => {
      before(async () => {

        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, role: 'User' });

      })
      it('should get error message', (done) => {
        request(app)
          .get('/api/admin/restaurants')
          .expect(401)
          .expect({ status: 'error', message: 'Permission denied' }, done)
      })

      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
      })
    })


    describe('if admin user logs in', () => {
      before(async () => {

        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, role: 'Admin' });
        await db.User.destroy({ where: {}, truncate: true })
        await db.Restaurant.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
        await db.OrderItem.destroy({ where: {}, truncate: true })
        await db.Meal.destroy({ where: {}, truncate: true })
        await db.Restaurant.create(defaultRestaurant1)
        await db.Meal.create({ quantity: 50 })
        await db.Order.create({ UserId: 1, require_date: tmr, order_status: '明日' })
        await db.OrderItem.create({ OrderId: 1, MealId: 1, quantity: 1 })

      })

      it('should see all restaurants desc by order_num and limit 10', (done) => {
        request(app)
          .get('/api/admin/restaurants')
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('restaurants')
            expect(res.body.restaurants.restaurants).to.be.an('array')
            expect(res.body.restaurants.restaurants.length).to.be.at.most(10)
            return done()
          })
      })
      //not done yet

      it('should be able to filter restaurants by location', (done) => {
        request(app)
          .get(`/api/admin/restaurants?dist=${content}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('restaurants')
            expect(res.body.restaurants.restaurants).to.be.an('array')
            return done()
          })
      })

      it('should see specific restaurant info', (done) => {
        request(app)
          .get('/api/admin/restaurants/1')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.be.equal('success')
            expect(res.body).to.have.property('restaurant')
            return done()
          })
      })

      it('fail to get specific restaurant info', (done) => {
        request(app)
          .get('/api/admin/restaurants/U001')
          .expect(400)
          .expect({ status: "error", message: "restaurant does not exist" }, done)
      })

      it('should be able to update specific restaurant info', (done) => {
        request(app)
          .put('/api/admin/restaurants/1')
          .set('Content-type', 'multipart/form-data')
          .field('name', 'john')
          .field('description', 'niceRestaurant22')
          .field('tel', '04-2657-6055')
          .field('address', 'somewhereInTaiwan')
          .field('lat', 25)
          .field('lng', 121)
          .field('location', '大安區')
          .attach('image', 'server/test/check.png')
          .expect(200)
          .end(async (err, res) => {
            const restaurant = await db.Restaurant.findByPk(1)
            expect(restaurant.name).to.be.equal('john')
            return done()
          })
      })

      it('should be able to delete specific restaurant info', (done) => {
        request(app)
          .delete('/api/admin/restaurants/1')
          .expect(200)
          .end((err, res) => {
            db.Restaurant.findByPk(1).then(restaurant => {
              expect(restaurant).to.be.null
              return done()
            })
          })
      })

      it('fail to delete specific restaurant info', (done) => {
        request(app)
          .delete('/api/admin/restaurants/U001')
          .expect(400)
          .expect({ status: "error", message: "restaurant does not exist" }, done)

      })

      it('should be able to see tomorrow orders', (done) => {
        request(app)
          .get(`/api/admin/orders?date=${tmr}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.message).to.be.equal('Successfully get Orders.')
            res.body.orders.map(item => {
              expect(item).to.have.property('User')
              expect(item).to.have.property('meals')
              expect(item).to.have.property('id')
              expect(item).to.have.property('require_date')
              expect(item).to.have.property('order_status')
              expect(item).to.have.property('date')
              expect(item).to.have.property('time')
            })
            return done()
          })
      })

      it('should see error message when orders can not be found', (done) => {
        request(app)
          .get('/api/admin/orders')
          .expect(200)
          .end((err, res) => {
            expect(res.body.message).to.be.equal('can not find any order')
            return done()
          })
      })

      it('should see specific order info', (done) => {
        request(app)
          .get('/api/order/1')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.status).to.be.equal('success')
            expect(res.body.message).to.be.equal('Successfully get the Order')
            expect(res.body).to.have.property('order')
            return done()
          })
      })

      it('fail to see specific order info', (done) => {
        request(app)
          .get('/api/order/2')
          .expect(400)
          .end(async (err, res) => {
            expect(res.body.status).to.be.equal('error')
            expect(res.body.message).to.be.equal('order does not exist')
            return done()
          })
      })

      it('should be able to update specific order info', (done) => {
        request(app)
          .put('/api/order/1')
          .send(`require_date=1991-04-14&quantity=2`)
          .expect(200)
          .end(async (err, res) => {
            const order = await db.Order.findByPk(1)
            expect(order.require_date).not.to.be.equal(tmr)
            expect(order).not.to.be.null
            return done()
          })
      })

      it('fail to update specific order info when you are not subscribe', (done) => {
        request(app)
          .put('/api/order/U001')
          .send(`require_date=1991-04-14&quantity=2`)
          .expect(400)
          .expect({ status: "error", "subscription": null, message: "you are not authorized to do that" }, done)
      })

      it('should not be able to cancel specific order(not a subscribe user)', (done) => {
        request(app)
          .put('/api/order/1/cancel')
          .expect(200)
          .end(async (err, res) => {
            expect({ status: "error", "subscription": null, message: "you are not authorized to do that" })
            return done()
          })
      })

      it('fail to delete specific order info', (done) => {
        request(app)
          .put('/api/order/1/cancel')
          .expect(400, done)
      })



      after(async () => {

        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({ where: {}, truncate: true })
        await db.Restaurant.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
        await db.OrderItem.destroy({ where: {}, truncate: true })

      })
    })


  })
});