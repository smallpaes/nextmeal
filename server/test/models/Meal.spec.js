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
const MealModel = require('../../models/meal')

describe('# Meal Model', () => {

  before(done => {
    done()
  })

  const Meal = MealModel(sequelize, dataTypes)
  const meal = new Meal()
  checkModelName(Meal)('Meal')

  context('properties', () => {
    ;[
      'name', 'image', 'description', 'quantity', 'RestaurantId', 'modifiedAt', 'isServing', 'nextServing'
    ].forEach(checkPropertyExists(meal))
  });

  context('associations', () => {
    const Order = 'Order'
    const Restaurant = 'Restaurant'
    before(() => {
      Meal.associate({ Order })
      Meal.associate({ Restaurant })
    })

    it('should belongs to users', (done) => {
      expect(Meal.belongsToMany).to.have.been.calledWith(Order)
      done()
    })

    it('should belongs to restaurants', (done) => {
      expect(Meal.belongsTo).to.have.been.calledWith(Restaurant)
      done()
    })

  })
  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Meal.create({}).then((meal) => {
        data = meal
        done()
      })
    })
    it('read', (done) => {
      db.Meal.findByPk(data.id).then((meal) => {
        expect(data.id).to.be.equal(meal.id)
        done()
      })
    })
    it('update', (done) => {
      db.Meal.update({}, { where: { id: data.id } }).then(() => {
        db.Meal.findByPk(data.id).then((meal) => {
          expect(data.updatedAt).to.be.not.equal(meal.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Meal.destroy({ where: { id: data.id } }).then(() => {
        db.Meal.findByPk(data.id).then((meal) => {
          expect(meal).to.be.equal(null)
          done()
        })
      })
    })
  })

})