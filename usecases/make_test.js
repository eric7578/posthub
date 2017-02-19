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
    make: proxyquire('./make', {
      '../repository/entity': entity
    })
  }
})

test('make root commit with message', async t => {
  const { entity, make } = t.context
  const createdCommit = {
    commitId: '6a7b8c9d510',
    message: 'message'
  }

  entity.createRoot.returns(createdCommit)
  const commit = await make('message')

  t.true(entity.createRoot.calledOnce)
  t.true(entity.createRoot.calledWithExactly('message'))
  t.deepEqual(commit, createdCommit)
})

test('make commit under exist parnet commit', async t => {
  const { entity, make } = t.context
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
  const commit = await make(message, parentId)

  t.true(entity.findById.calledOnce)
  t.true(entity.findById.calledWithExactly(parentId))

  t.true(entity.create.calledOnce)
  t.true(entity.create.calledWithExactly(message, parentId))
  t.deepEqual(commit, createdCommit)
})

test('make commit under not exist parnet commit', async t => {
  const { entity, make } = t.context
  const parentId = 'parentId'
  const message = 'message'

  entity.findById.returns(null)

  t.throws(make(message, parentId), 'parent not exist')
})
