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
const OrderModel = require('../../models/order')

describe('# Order Model', () => {

  before(done => {
    done()
  })

  const Order = OrderModel(sequelize, dataTypes)
  const order = new Order()
  checkModelName(Order)('Order')

  context('properties', () => {
    ;[
      'UserId', 'order_date', 'require_date', 'order_status'
    ].forEach(checkPropertyExists(order))
  });

  context('associations', () => {
    const User = 'User'
    const Meal = 'Meal'
    before(() => {
      Order.associate({ User })
      Order.associate({ Meal })
    })

    it('should belongs to users', (done) => {
      expect(Order.belongsTo).to.have.been.calledWith(User)
      done()
    })

    it('should belongs to many meals', (done) => {
      expect(Order.belongsToMany).to.have.been.calledWith(Meal)
      done()
    })

  })
  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Order.create({}).then((order) => {
        data = order
        done()
      })
    })
    it('read', (done) => {
      db.Order.findByPk(data.id).then((order) => {
        expect(data.id).to.be.equal(order.id)
        done()
      })
    })
    it('update', (done) => {
      db.Order.update({}, { where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(data.updatedAt).to.be.not.equal(order.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Order.destroy({ where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(order).to.be.equal(null)
          done()
        })
      })
    })
  })

})