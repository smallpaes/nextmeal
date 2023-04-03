var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;

var app = require('../../app')
var helpers = require('../../_helpers');
const db = require('../../models')
const moment = require('moment-timezone')
const defaultRestaurant1 = {
  name: "Danny的小餐館",
  rating: 4.8,
  location: "大安區",
  address: "台北市大安區臥龍街289號",
  lat: '25.017186',
  lng: '121.558462',
  description: '一家還不錯的店',
  image: 'https://randomuser.me/api/portraits/lego/1.jpg'
}
const content = encodeURIComponent('大安區')

describe('# User: request', () => {

  context('go to home/restaurant page', () => {

    describe('if a visiter/user visit', () => {

      before(async () => {
        await db.Restaurant.destroy({ where: {}, truncate: true })
        await db.Subscription.destroy({ where: {}, truncate: true })
        await db.Restaurant.create(defaultRestaurant1)
        await db.Subscription.create({ UserId: 1, payment_status: true, sub_expired_date: moment().add(2, 'days').endOf('day').utc().format("YYYY-MM-DD HH:mm:ss"), sub_balance: 10 })
      })

      it('should see the home page info', (done) => {
        request(app)
          .get(`/api/restaurants?dist=${content}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('popular_restaurants')
            expect(res.body).to.have.property('districts')
            return done()
          })
      })

      it('should see specific restaurant info', (done) => {
        request(app)
          .get('/api/restaurants/1')
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('restaurant')
            expect(res.body).to.have.property('districts')
            return done()
          })
      })

      after(async () => {
        await db.Restaurant.destroy({ where: {}, truncate: true })
      })


    })

  })

  context('user actions', () => {

    describe('if user not log in', () => {

      before(async (done) => {
        done()
      })
      it('should get Unauthorized', (done) => {
        request(app)
          .get('/api/users/profile')
          .expect(401)
          .end((err, res) => {
            if (err) { return done(err) }
            res.text.should.include('Unauthorized')
            done()
          })
      })
    })

    describe('if user logs in', () => {
      before(async () => {

        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, role: 'User' });
        await db.User.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Meal.destroy({ where: {}, truncate: true })
        await db.Restaurant.destroy({ where: {}, truncate: true })
        await db.OrderItem.destroy({ where: {}, truncate: true })
        await db.User.create({ name: "Danny" })
        await db.User.create({ name: "John" })
        await db.Restaurant.create({ name: 'Danny home', UserId: 1 })
        await db.Meal.create({ name: "蔥燒豬排", quantity: 50, RestaurantId: 1 })
        await db.OrderItem.create({ OrderId: 1, MealId: 1, quantity: 1 })
        await db.Order.create({ UserId: 2 })

      })
      it('should get user info', (done) => {
        request(app)
          .get('/api/users/profile')
          .expect(200)
          .end((err, res) => {
            expect(res.body.user).to.have.property('name')
            expect(res.body.user).to.have.property('id')
            expect(res.body.user).to.have.property('address')
            expect(res.body.user).to.have.property('location')
            expect(res.body.user).to.have.property('lat')
            expect(res.body.user).to.have.property('lng')
            expect(res.body.user).to.have.property('dob')
            expect(res.body.user).to.have.property('prefer')
            return done()
          })
      })


      it('should be able to update user info', (done) => {
        request(app)
          .put('/api/users/profile')
          .send('name=John&email=user2@example.com&address=somewhere&dob=1991-04-14&prefer=nothing&lat=25&lng=121&location=大安區')
          .expect(200, done)
      })

      it('should be able to post a new order', (done) => {
        request(app)
          .post('/api/order/new')
          .send('meal_id=1&require_date=11:30&quantity=1')
          .expect(200)
          .end(async (err, res) => {
            const order = await db.Order.findByPk(2)
            expect(order).not.to.be.null
            return done()
          })
      })

      it('should be able to read an order info', (done) => {
        request(app)
          .get('/api/order/2')
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.status).to.be.equal('success')
            expect(res.body.order).to.have.property('id')
            return done()
          })
      })

      it('should be not able to update an order when there are missing fields', (done) => {
        request(app)
          .put('/api/order/2')
          .send('order_status=done')
          .expect(422)
          .end((err, res) => {
            expect(res.body.status).to.be.equal('error')
            expect(res.body.message).to.be.equal('Information should be filled')
            return done()
          })
      })

      it('should be able to update an order info', (done) => {
        request(app)
          .put('/api/order/2')
          .send('require_date=13:30&quantity=3')
          .expect(200)
          .end(async (err, res) => {
            const order = await db.Order.findByPk(2)
            expect(order.amount).to.be.equal(3)
            return done()
          })
      })


      it('should be not able to cancel other users order', (done) => {
        request(app)
          .put('/api/order/1/cancel')
          .send('order_status=done')
          .expect(400)
          .expect({ status: 'error', message: 'You are not allow this action.' }, done)
      })

      it('should be able to cancel an order', (done) => {
        request(app)
          .put('/api/order/2/cancel')
          .expect(400)
          .end(async (err, res) => {
            expect(res.body.message).to.be.equal('Successfully cancel the order.')
            const order = await db.Order.findByPk(2)
            expect(order.order_status).to.be.equal('取消')
            return done()
          })
      })

      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.Subscription.destroy({ where: {}, truncate: true })
        await db.Meal.destroy({ where: {}, truncate: true })
        await db.User.destroy({ where: {}, truncate: true })
        await db.Restaurant.destroy({ where: {}, truncate: true })
        await db.OrderItem.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
      })
    })

  })
});