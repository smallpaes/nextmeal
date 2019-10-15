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
const CommentModel = require('../../models/comment')

describe('# Comment Model', () => {

  before(done => {
    done()
  })

  const Comment = CommentModel(sequelize, dataTypes)
  const comment = new Comment()
  checkModelName(Comment)('Comment')

  context('properties', () => {
    ;[
      'user_text', 'res_text', 'rating', 'image', 'UserId', 'RestaurantId'
    ].forEach(checkPropertyExists(comment))
  });

  context('associations', () => {
    const User = 'User'
    const Restaurant = 'Restaurant'
    before(() => {
      Comment.associate({ User })
      Comment.associate({ Restaurant })
    })

    it('should belongs to users', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(User)
      done()
    })

    it('should belongs to restaurants', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(Restaurant)
      done()
    })

  })
  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Comment.create({}).then((comment) => {
        data = comment
        done()
      })
    })
    it('read', (done) => {
      db.Comment.findByPk(data.id).then((comment) => {
        expect(data.id).to.be.equal(comment.id)
        done()
      })
    })
    it('update', (done) => {
      db.Comment.update({}, { where: { id: data.id } }).then(() => {
        db.Comment.findByPk(data.id).then((comment) => {
          expect(data.updatedAt).to.be.not.equal(comment.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Comment.destroy({ where: { id: data.id } }).then(() => {
        db.Comment.findByPk(data.id).then((comment) => {
          expect(comment).to.be.equal(null)
          done()
        })
      })
    })
  })

})