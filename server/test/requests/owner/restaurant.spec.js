var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;
const today = (new Date()).getDay()
var app = require('../../../app')
var helpers = require('../../../_helpers');
const db = require('../../../models')
const defaultRestaurant1 = {
  name: 'Danny的小廚房',
  location: "大安區",
  category: '美式餐廳',
  tel: '0933123456',
  description: '還不錯的店面',
  image: '',
  UserId: 1
}


describe('# Admin::Owner request', () => {

  context('go to owner restaurant page', () => {

    describe('if user not log in', () => {

      before(async (done) => {
        done()
      })
      it('should get Unauthorized', (done) => {
        request(app)
          .get('/api/owner')
          .expect(401)
          .end((err, res) => {
            if (err) { return done(err) }
            res.text.should.include('Unauthorized')
            done()
          })
      })
    })

    describe('if not owner user logs in', () => {
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
          .get('/api/owner')
          .expect(401)
          .expect({ status: 'error', message: 'Permission denied' }, done)
      })

      after(async () => {
        this.ensureAuthenticated.restore();
        this.getUser.restore();
      })
    })


    describe('if owner user logs in', () => {
      before(async () => {

        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, role: 'Owner' });
        await db.User.destroy({ where: {}, truncate: true })
        await db.Restaurant.destroy({ where: {}, truncate: true })
        await db.Meal.destroy({ where: {}, truncate: true })
        await db.Meal.create({ name: '蒜泥白肉', RestaurantId: 1, isServing: 1, nextServing: 1 })
        // await db.Meal.create({ name: '蒜泥白肉2', RestaurantId: 1, isServing: true, nextServing: true })


      })

      it('should be able to post a new restaurant', (done) => {
        request(app)
          .post('/api/owner')
          .send('name=dannyRestaurant&description=sometext&tel=12345678&address=somewhere&lat=25&lng=121')
          .expect(200)
          .expect({ status: 'success', message: 'successfully add a new restaurant' })
          .end(async (err, res) => {
            const restaurant = await db.Restaurant.findByPk(1)
            expect(restaurant.name).to.be.equal('dannyRestaurant')
            return done()
          })
      })

      it('should see his/her restaurant info if there is one', (done) => {
        request(app)
          .get('/api/owner')
          .expect(200)
          .end((err, res) => {
            expect(res.body.restaurant[0]).to.have.property('name')
            return done()
          })
      })

      it('should be able to update restaurant info', (done) => {
        request(app)
          .put('/api/owner')
          .send('name=MikeRestaurant&description=sometext&tel=12345678&address=somewhere&lat=25&lng=121')
          .expect(200)
          .end(async (err, res) => {
            const restaurant = await db.Restaurant.findByPk(1)
            expect(restaurant.name).to.be.equal('MikeRestaurant')
            expect(res.body.status).to.be.equal('success')
            return done()
          })
      })



      it('should see all meals', (done) => {
        request(app)
          .get('/api/owner/dishes')
          .expect(200)
          .end(async (err, res) => {
            res.body.meals.map(item => {
              expect(item).to.have.property('name')
            })
            return done()
          })
      })

      it('should be able to post a new meal', (done) => {
        request(app)
          .post('/api/owner/dishes')
          .send('name=tomatosoup&description=handmade')
          .expect(200)
          .end(async (err, res) => {
            const meal = await db.Meal.findByPk(2)
            expect(meal.name).to.be.equal('tomatosoup')
            expect(res.body.status).to.be.equal('success')
            return done()
          })
      })

      it('should be able to get a specific meal info', (done) => {
        request(app)
          .get('/api/owner/dishes/2')
          .expect(200)
          .end(async (err, res) => {
            const meal = await db.Meal.findByPk(2)
            expect(meal.name).to.be.equal('tomatosoup')
            return done()
          })
      })

      it('fail to get specific meal info', (done) => {
        request(app)
          .get('/api/owner/dishes/17')
          .expect(422)
          .expect({ status: "error", message: "meal does not exist" }, done)

      })

      it('should be able to update specific meal info', (done) => {
        request(app)
          .put('/api/owner/dishes/2/edit')
          .send('name=tomatosoup2&description=handmade')
          .expect(200)
          .end(async (err, res) => {
            const meal = await db.Meal.findByPk(2)
            expect(meal.name).to.be.equal('tomatosoup2')
            return done()
          })
      })
      if (today >= 6) {
        it('should not be able to update next week menu info after Saturday', (done) => {
          request(app)
            .put('/api/owner/menu')
            .send('quantity=60&id=1')
            .expect(400, done)
        })

      } else {
        it('should be able to update next week menu info by Saturday', (done) => {
          request(app)
            .put('/api/owner/menu')
            .send('quantity=60&id=1')
            .expect(200)
            .end(async (err, res) => {
              const meal = await db.Meal.findByPk(1)
              expect(meal.nextServing_quantity).to.be.equal(60)
              return done()
            })
        })
      }

      it('should be able to delete specific meal info', (done) => {
        request(app)
          .delete('/api/owner/dishes/1')
          .expect(200)
          .end(async (err, res) => {
            const meal = await db.Meal.findByPk(1)
            expect(meal).to.be.null
            return done()
          })
      })

      it('should see this week menu info', (done) => {
        request(app)
          .get('/api/owner/menu?ran=thisWeek')
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('meals')
            expect(res.body.status).to.have.be.equal('success')
            return done()
          })
      })

      it('should see next week menu info', (done) => {
        request(app)
          .get('/api/owner/menu?ran=nextWeek')
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('meals')
            expect(res.body.status).to.have.be.equal('success')
            return done()
          })
      })





      after(async () => {

        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({ where: {}, truncate: true })
        await db.Meal.destroy({ where: {}, truncate: true })
        await db.Restaurant.destroy({ where: {}, truncate: true })
      })
    })


  })
});