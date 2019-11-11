var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;

var app = require('../../../app')
var helpers = require('../../../_helpers');
const db = require('../../../models')
const defaultUser1 = {
  name: "Danny",
  location: "大安區",
  payment_status: true,
  address: "台北市大安區臥龍街289號",
  prefer: '美式料理',
  lat: '25.017186',
  lng: '121.558462',
  role: 'Admin',
  order_num: 20
}

const defaultUser2 = {
  name: "Tao",
  location: "大安區",
  payment_status: true,
  address: "台北市大安區臥龍街289號",
  prefer: '素食料理',
  lat: '25.017186',
  lng: '121.558462',
  role: 'Admin',
  order_num: 45
}

const defaultUser3 = {
  name: "Mike",
  location: "大安區",
  payment_status: false,
  address: "台北市大安區臥龍街289號",
  prefer: '日式料理',
  lat: '25.017186',
  lng: '121.558462',
  role: 'Admin',
  order_num: 18
}


describe('# Admin::User request', () => {

  context('go to admin user page', () => {

    describe('if user not log in', () => {

      before(async (done) => {
        done()
      })
      it('should get Unauthorized', (done) => {
        request(app)
          .get('/api/admin/users')
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
          .get('/api/admin/users')
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
        await db.User.create(defaultUser1)
        await db.User.create(defaultUser2)
        await db.User.create(defaultUser3)
        await db.Subscription.create({ UserId: 1 })
        await db.Subscription.create({ UserId: 2 })
        await db.Subscription.create({ UserId: 3 })
        await db.Order.create({ UserId: 1 })
        await db.Order.create({ UserId: 1 })
        await db.Order.create({ UserId: 2 })

      })

      it('should see all users desc by order_num', (done) => {
        request(app)
          .get('/api/admin/users')
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('users')
            expect(res.body.users[0].order_num).to.be.greaterThan(res.body.users[1].order_num)
            expect(res.body.users.length).to.be.equal(3)
            expect(res.body.message).to.be.equal('Admin get users info.')
            return done()
          })
      })

      // it('should be able to filter user by payment_status', (done) => {
      //   request(app)
      //     .get('/api/admin/users?payment_status=true')
      //     .expect(200)
      //     .end(async (err, res) => {
      //       expect(res.body.users.length).to.be.equal(1)
      //       return done()
      //     })
      // })

      it('should see specific user info', (done) => {
        request(app)
          .get('/api/admin/users/1')
          .expect(200)
          .end((err, res) => {
            expect(res.body.user).to.have.property('name')
            expect(res.body.user).to.have.property('location')
            expect(res.body.user).to.have.property('lat')
            expect(res.body.user).to.have.property('lng')
            expect(res.body.user).to.have.property('address')
            expect(res.body.user).to.have.property('role')
            expect(res.body.user).to.have.property('email')
            return done()
          })
      })

      it('fail to get specific user info', (done) => {
        request(app)
          .get('/api/admin/users/U100')
          .expect(400)
          .expect({ status: "error", user: null, message: "user does not exist" }, done)
      })

      it('should be able to update specific user info', (done) => {
        request(app)
          .put('/api/admin/users/1')
          .send('name=john&email=user2@example.com&address=somewhere&dob=1991-04-14&prefer=nothing&lat=25&lng=121&location=somewhereInTaiwan&tel=04-2657-6099')
          .expect(200)
          .end(async (err, res) => {
            const user = await db.User.findByPk(1)
            expect(user.name).to.be.equal('john')
            return done()
          })
      })


      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({ where: {}, truncate: true })
      })
    })


  })
});