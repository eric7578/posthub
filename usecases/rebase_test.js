const test = require('ava')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')

test.beforeEach(t => {
  const entity = {
    findById: stub(),
    updateParent: stub()
  }
  t.context = {
    entity,
    rebase: proxyquire('./rebase', {
      '../repository/entity': entity
    })
  }
})

test('change parent commit to another', async t => {
  const { rebase, entity } = t.context
  const user = {}
  const commitId = 'commitId'
  const parentId = 'parentId'

  entity.findById.withArgs(commitId).returns({ commitId, level: 1 })
  entity.findById.withArgs(parentId).returns({ commitId: parentId, level: 0 })

  const regsitedUser = await rebase(user, commitId, parentId)

  t.true(entity.findById.calledTwice)
  t.true(entity.findById.calledWithExactly(commitId))
  t.true(entity.findById.calledWithExactly(parentId))
  t.true(entity.updateParent.calledWithExactly(commitId, parentId))
})

test('throw commitNotFound if commit/parent is not exist', t => {
  const { rebase, entity } = t.context
  const user = {}
  const commitId = 'commitId'
  const parentId = 'parentId'

  entity.findById.withArgs(commitId).returns(null)
  entity.findById.withArgs(parentId).returns(null)

  t.throws(rebase(user, commitId, parentId), 'commitNotFound')
})

test('throw levelNotMatch if commit level is not greater than parent commit\'s level', t => {
  const { rebase, entity } = t.context
  const user = {}
  const commitId = 'commitId'
  const parentId = 'parentId'

  entity.findById.withArgs(commitId).returns({ commitId, level: 1 })
  entity.findById.withArgs(parentId).returns({ commitId: parentId, level: 1 })

  t.throws(rebase(user, commitId, parentId), 'levelNotMatch')
})
