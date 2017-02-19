const test = require('ava')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')

test.beforeEach(t => {
  const entity = {
    createRoot: stub(),
    create: stub(),
    findById: stub()
  }
  t.context = {
    entity,
    commit: proxyquire('./commit', {
      '../repository/entity': entity
    })
  }
})

test('commit root with message', async t => {
  const { entity, commit } = t.context
  const createdCommit = {
    commitId: '6a7b8c9d510',
    message: 'message'
  }

  entity.createRoot.returns(createdCommit)
  const ret = await commit('message')

  t.true(entity.createRoot.calledOnce)
  t.true(entity.createRoot.calledWithExactly('message'))
  t.deepEqual(ret, createdCommit)
})

test('commit under exist parnet', async t => {
  const { entity, commit } = t.context
  const parentId = 'parentId'
  const message = 'message'
  const parentCommit = {
    commitId: parentId,
    message: 'parent message'
  }
  const createdCommit = {
    commitId: '6a7b8c9d510',
    message
  }

  entity.findById.returns(parentCommit)
  entity.create.returns(createdCommit)
  const ret = await commit(message, parentId)

  t.true(entity.findById.calledOnce)
  t.true(entity.findById.calledWithExactly(parentId))

  t.true(entity.create.calledOnce)
  t.true(entity.create.calledWithExactly(message, parentId))
  t.deepEqual(ret, createdCommit)
})

test('commit under not exist parnet', async t => {
  const { entity, commit } = t.context
  const parentId = 'parentId'
  const message = 'message'

  entity.findById.returns(null)

  t.throws(commit(message, parentId), 'parent not exist')
})
