var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;

var app = require('../../../app')
var helpers = require('../../../_helpers');
const db = require('../../../models')

const defaultRestaurant1 = {
  name: "Danny的小餐館",
  rating: 4.8,
  location: "大安區",
  address: "台北市大安區臥龍街289號",
  latitude: '25.017186',
  longitude: '121.558462'
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
        await db.Restaurant.create(defaultRestaurant1)
        await db.Order.create({ UserId: 1, order_date: new Date() })

      })

      it('should see all restaurants desc by order_num and limit 10', (done) => {
        request(app)
          .get('/api/admin/restaurants')
          .expect(200)
          .then(response => {
            expect(response.body).to.have.property('restaurants')
            done()
          }).catch(err => console.log(err))
      })

      // it('should be able to filter restaurants by location', (done) => {
      //   request(app)
      //     .get('/api/admin/users?dist=')
      //     .expect(200)
      //     .end(async (err, res) => {
      //       const users = await db.User.findAll()
      //       expect(users.length).to.be.equal(3)
      //       return done()
      //     })
      // })

      it('should see specific restaurant info', (done) => {
        request(app)
          .get('/api/admin/restaurants/1')
          .expect(200)
          .then(response => {
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('location')
            expect(response.body).to.have.property('rating')
            done()
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
          .send('name=john')
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

      it('should see all orders', (done) => {
        request(app)
          .get('/api/admin/orders')
          .expect(200)
          .end((err, res) => {
            res.body.orders.map(item => {
              expect(item).to.have.property('user_name')
              expect(item).to.have.property('restaurant_name')
              expect(item).to.have.property('require_date')
              expect(item).to.have.property('require_time')
            })
            return done()
          })
      })

      it('should see specific order info', (done) => {
        request(app)
          .get('/api/admin/orders/1')
          .expect(200)
          .end(async (err, res) => {
            const order = await db.Order.findByPk(1)
            expect(order).not.to.be.null
            return done()
          })
      })

      it('should be able to  update  specific order info', (done) => {
        request(app)
          .put('/api/admin/orders/1')
          .send('order_status=done')
          .expect(200)
          .end(async (err, res) => {
            const order = await db.Order.findByPk(1)
            expect(order.order_status).to.be.equal('done')
            return done()
          })
      })

      it('should be able to delete specific order info', (done) => {
        request(app)
          .delete('/api/admin/orders/1')
          .expect(200)
          .end(async (err, res) => {
            const order = await db.Order.findByPk(1)
            expect(order).to.be.null
            return done()
          })
      })



      after(async () => {

        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({ where: {}, truncate: true })
        await db.Restaurant.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
      })
    })


  })
});