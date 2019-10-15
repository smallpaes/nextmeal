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
const SubscriptionModel = require('../../models/subscription')

describe('# Subscription Model', () => {

  before(done => {
    done()
  })

  const Subscription = SubscriptionModel(sequelize, dataTypes)
  const subscription = new Subscription()
  checkModelName(Subscription)('Subscription')

  context('properties', () => {
    ;[
      'UserId', 'sub_name', 'sub_price', 'sub_description', 'sub_expired_date', 'sub_date', 'payment_status'
    ].forEach(checkPropertyExists(subscription))
  });

  context('associations', () => {
    const Payment = 'Payment'
    const User = 'User'
    before(() => {
      Subscription.associate({ User })
      Subscription.associate({ Payment })
    })

    it('should belongs to user', (done) => {
      expect(Subscription.belongsTo).to.have.been.calledWith(User)
      done()
    })

    it('should have many payments', (done) => {
      expect(Subscription.hasMany).to.have.been.calledWith(Payment)
      done()
    })

  })
  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Subscription.create({}).then((subscription) => {
        data = subscription
        done()
      })
    })
    it('read', (done) => {
      db.Subscription.findByPk(data.id).then((subscription) => {
        expect(data.id).to.be.equal(subscription.id)
        done()
      })
    })
    it('update', (done) => {
      db.Subscription.update({}, { where: { id: data.id } }).then(() => {
        db.Subscription.findByPk(data.id).then((subscription) => {
          expect(data.updatedAt).to.be.not.equal(subscription.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Subscription.destroy({ where: { id: data.id } }).then(() => {
        db.Subscription.findByPk(data.id).then((subscription) => {
          expect(subscription).to.be.equal(null)
          done()
        })
      })
    })
  })

})