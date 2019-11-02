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
const RestaurantModel = require('../../models/restaurant')

describe('# Restaurant Model', () => {

  before(done => {
    done()
  })

  const Restaurant = RestaurantModel(sequelize, dataTypes)
  const restaurant = new Restaurant()
  checkModelName(Restaurant)('Restaurant')

  context('properties', () => {
    ;[
      'name', 'description', 'image', 'location', 'tel', 'rating', 'lat', 'lng', 'address', 'CategoryId', 'UserId', "opening_hour", "closing_hour"
    ].forEach(checkPropertyExists(restaurant))
  });

  context('associations', () => {
    const Meal = 'Meal'
    const Category = 'Category'
    const Comment = 'Comment'
    const Like = 'Like'
    const User = 'User'

    before(() => {
      Restaurant.associate({ Meal })
      Restaurant.associate({ Category })
      Restaurant.associate({ Comment })
      Restaurant.associate({ User })
      Restaurant.associate({ Like })
    })

    it('should have many meals', (done) => {
      expect(Restaurant.hasMany).to.have.been.calledWith(Meal)
      done()
    })

    it('should have many likes', (done) => {
      expect(Restaurant.hasMany).to.have.been.calledWith(Like)
      done()
    })

    it('should have many comments', (done) => {
      expect(Restaurant.hasMany).to.have.been.calledWith(Comment)
      done()
    })

    it('should belongs to category', (done) => {
      expect(Restaurant.belongsTo).to.have.been.calledWith(Category)
      done()
    })

    it('should belongs to user', (done) => {
      expect(Restaurant.belongsTo).to.have.been.calledWith(User)
      done()
    })

  })
  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Restaurant.create({}).then((restaurant) => {
        data = restaurant
        done()
      })
    })
    it('read', (done) => {
      db.Restaurant.findByPk(data.id).then((restaurant) => {
        expect(data.id).to.be.equal(restaurant.id)
        done()
      }).catch(done)
    })
    it('update', (done) => {
      db.Restaurant.update({}, { where: { id: data.id } }).then(() => {
        db.Restaurant.findByPk(data.id).then((restaurant) => {
          expect(data.updatedAt).to.be.not.equal(restaurant.updatedAt)
          done()
        }).catch(done)
      })
    })
    it('delete', (done) => {
      db.Restaurant.destroy({ where: { id: data.id } }).then(() => {
        db.Restaurant.findByPk(data.id).then((restaurant) => {
          expect(restaurant).to.be.equal(null)
          done()
        }).catch(done)
      })
    })
  })

})