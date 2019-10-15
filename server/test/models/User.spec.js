// process.env.NODE_ENV = 'test'


var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));
const { expect } = require('chai')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const UserModel = require('../../models/user')

describe('# UserModel Model', () => {

  before(done => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()
  checkModelName(User)('User')

  context('properties', () => {
    ;[
      'name', 'email', 'password', 'avatar', 'location', 'latitude', 'longitude', 'address', 'dob', 'modifiedAt', 'prefer', 'role'
    ].forEach(checkPropertyExists(user))
  });

  context('associations', () => {
    const Subscription = 'Subscription'
    const Comment = 'Comment'
    const Like = 'Like'
    const Order = 'Order'
    const Restaurant = 'Restaurant'
    before(() => {
      User.associate({ Subscription })
      User.associate({ Comment })
      User.associate({ Like })
      User.associate({ Order })
      User.associate({ Restaurant })
    })

    it('should have many subscriptions', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Subscription)
      done()
    })
    it('should have many comments', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Comment)
      done()
    })
    it('should have many likes', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Like)
      done()
    })
    it('should have many orders', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Order)
      done()
    })
    it('should have one restaurant', (done) => {
      expect(User.hasOne).to.have.been.calledWith(Restaurant)
      done()
    })
  })
  context('action', () => {
    let data = null

    it('create', (done) => {
      db.User.create({}).then((user) => {
        data = user
        done()
      })
    })
    it('read', (done) => {
      db.User.findByPk(data.id).then((user) => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    it('update', (done) => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })

})