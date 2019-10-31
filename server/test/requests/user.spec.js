// var chai = require('chai')
// var request = require('supertest')
// var sinon = require('sinon')
// var should = chai.should();
// var expect = chai.expect;

// var app = require('../../app')
// var helpers = require('../../_helpers');
// const db = require('../../models')
// const defaultRestaurant1 = {
//   name: "Danny的小餐館",
//   rating: 4.8,
//   location: "大安區",
//   address: "台北市大安區臥龍街289號",
//   lat: '25.017186',
//   lng: '121.558462',
//   description: '一家還不錯的店',
//   image: 'https://randomuser.me/api/portraits/lego/1.jpg'
// }

// describe('# User: request', () => {

//   context('go to home/restaurant page', () => {

//     describe('if a visiter/user visit', () => {

//       before(async (done) => {
//         await db.Restaurant.destroy({ where: {}, truncate: true })
//         await db.Restaurant.create(defaultRestaurant1)
//         done()
//       })

//       it('should see the home page info', (done) => {
//         request(app)
//           .get('/api')
//           .expect(200)
//           .end((err, res) => {
//             expect(res.body).to.have.property('popular_restaurants')
//             expect(res.body).to.have.property('category')
//             expect(res.body).to.have.property('districts')
//             return done()
//           })
//       })

//       it('should see district restaurants info', (done) => {
//         request(app)
//           .get('/api/restaurants')
//           .expect(200)
//           .end((err, res) => {
//             expect(res.body).to.have.property('popular_restaurants')
//             expect(res.body).to.have.property('more_restaurants')
//             expect(res.body).to.have.property('districts')
//             return done()
//           })
//       })

//       it('should see specific restaurant info', (done) => {
//         request(app)
//           .get('/api/restaurants/1')
//           .expect(200)
//           .end((err, res) => {
//             expect(res.body).to.have.property('restaurant')
//             expect(res.body).to.have.property('districts')
//             return done()
//           })
//       })

//       after(async () => {
//         await db.Restaurant.destroy({ where: {}, truncate: true })
//       })


//     })

//   })

//   context('user actions', () => {

//     describe('if user not log in', () => {

//       before(async (done) => {
//         done()
//       })
//       it('should get Unauthorized', (done) => {
//         request(app)
//           .get('/api/users/1')
//           .expect(401)
//           .end((err, res) => {
//             if (err) { return done(err) }
//             res.text.should.include('Unauthorized')
//             done()
//           })
//       })
//     })

//     describe('if user logs in', () => {
//       before(async () => {

//         this.ensureAuthenticated = sinon.stub(
//           helpers, 'ensureAuthenticated'
//         ).returns(true);
//         this.getUser = sinon.stub(
//           helpers, 'getUser'
//         ).returns({ id: 1, role: 'User' });
//         await db.User.destroy({ where: {}, truncate: true })
//         await db.Order.destroy({ where: {}, truncate: true })
//         await db.User.create({ name: "Danny" })
//         await db.User.create({ name: "John" })
//         await db.Order.create({ UserId: 2 })

//       })
//       it('should get user info', (done) => {
//         request(app)
//           .get('/api/users/1')
//           .expect(200)
//           .end((err, res) => {
//             expect(res.body).to.have.property('name')
//             return done()
//           })
//       })

//       it('should be not get other users info', (done) => {
//         request(app)
//           .get('/api/users/2')
//           .expect(400)
//           .expect({ status: 'error', message: 'you are not authorized to do that' }, done)
//       })

//       it('should get user info(edit page)', (done) => {
//         request(app)
//           .get('/api/users/1/edit')
//           .expect(200)
//           .end((err, res) => {
//             expect(res.body).to.have.property('name')
//             return done()
//           })
//       })

//       it('should not get other users info(edit page)', (done) => {
//         request(app)
//           .get('/api/users/2/edit')
//           .expect(400)
//           .expect({ status: 'error', message: 'you are not authorized to do that' }, done)
//       })

//       it('should be able to update user info', (done) => {
//         request(app)
//           .put('/api/users/1/edit')
//           .send('name=John')
//           .expect(200)
//           .end(async (err, res) => {
//             const user = await db.User.findByPk(1)
//             expect(user.name).to.be.equal('John')
//             return done()
//           })
//       })

//       it('should not be able to update  other users info', (done) => {
//         request(app)
//           .put('/api/users/2/edit')
//           .send('name=switch')
//           .expect(400)
//           .expect({ status: 'error', message: 'you are not authorized to do that' }, done)
//       })

//       it('should be able to post a new order', (done) => {
//         request(app)
//           .put('/api/order/new')
//           .send('order_status=prepared')
//           .expect(200)
//           .expect({ status: 'success', message: 'successfully add a new order' })
//           .end(async (err, res) => {
//             const order = await db.Order.findByPk(2)
//             expect(order.order_status).to.be.equal('prepared')
//             return done()
//           })
//       })

//       it('should be able to read an order info', (done) => {
//         request(app)
//           .get('/api/order/2')
//           .expect(200)
//           .end(async (err, res) => {
//             const order = await db.Order.findByPk(1)
//             expect(order.order_status).to.be.equal('prepared')
//             return done()
//           })
//       })

//       it('should be not able to update other users order', (done) => {
//         request(app)
//           .put('/api/order/1')
//           .send('order_status=done')
//           .expect(400)
//           .expect({ status: 'error', message: 'you are not authorized to do that' }, done)
//       })

//       it('should be able to update an order info', (done) => {
//         request(app)
//           .put('/api/order/2')
//           .send('order_status=done')
//           .expect(200)
//           .expect({ status: 'success', message: 'successfully update order info' })
//           .end(async (err, res) => {
//             const order = await db.Order.findByPk(1)
//             expect(order.order_status).to.be.equal('done')
//             return done()
//           })
//       })


//       it('should be not able to delete other users order', (done) => {
//         request(app)
//           .delete('/api/order/1')
//           .send('order_status=done')
//           .expect(400)
//           .expect({ status: 'error', message: 'you are not authorized to do that' }, done)
//       })

//       it('should be able to delete an order', (done) => {
//         request(app)
//           .delete('/api/order/2')
//           .expect(200)
//           .expect({ status: 'success', message: 'successfully delete an order' }, done)
//       })

//       after(async () => {
//         this.ensureAuthenticated.restore();
//         this.getUser.restore();
//       })
//     })

//   })
// });