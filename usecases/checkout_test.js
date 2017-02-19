const test = require('ava')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')

test.beforeEach(t => {
  const entity = {
    findById: stub()
  }
  t.context = {
    entity,
    checkout: proxyquire('./checkout', {
      '../repository/entity': entity
    })
  }
})

test('checkout commit with commitId', async t => {
  const { entity, checkout } = t.context
  const commitId = '6a7b8c9d510'
  const user = {}
  const commit = {
    commitId
  }

  entity.findById.returns(commit)

  const foundCommit = await checkout(user, commitId)

  t.true(entity.findById.calledOnce)
  t.true(entity.findById.calledWithExactly(commitId))
  t.deepEqual(foundCommit, commit)
})

test('checkout commit parents until parentId is null', async t => {
  const { entity, checkout } = t.context
  const commitId = '6a7b8c9d510'
  const parentId = '11e12f13g14'
  const grandId = '15h16i17j18'
  const user = {}
  const commit = {
    commitId,
    parentId
  }
  const parentCommit = {
    commitId: parentId,
    parentId: grandId
  }
  const grandCommit = {
    commitId: grandId,
    parentId: null
  }

  entity.findById.onFirstCall().returns(commit)
  entity.findById.onSecondCall().returns(parentCommit)
  entity.findById.onThirdCall().returns(grandCommit)

  const commits = await checkout.parents(user, commitId)

  t.is(entity.findById.callCount, 3)
  t.deepEqual(commits, [ commit, parentCommit, grandCommit ])
})

test('checkout commit parents until match checkout times', async t => {
  const { entity, checkout } = t.context
  const commitId = '6a7b8c9d510'
  const parentId = '11e12f13g14'
  const grandId = '15h16i17j18'
  const user = {}
  const checkoutTimes = 2
  const commit = {
    commitId,
    parentId
  }
  const parentCommit = {
    commitId: parentId,
    parentId: grandId
  }
  const grandCommit = {
    commitId: grandId,
    parentId: null
  }

  entity.findById.onFirstCall().returns(commit)
  entity.findById.onSecondCall().returns(parentCommit)
  entity.findById.onThirdCall().returns(grandCommit)

  const commits = await checkout.parents(user, commitId, checkoutTimes)

  t.is(entity.findById.callCount, checkoutTimes)
  t.deepEqual(commits, [ commit, parentCommit ])
})

test('checkout times limited by number of parents', async t => {
  const { entity, checkout } = t.context
  const commitId = '6a7b8c9d510'
  const parentId = '11e12f13g14'
  const grandId = '15h16i17j18'
  const user = {}
  const checkoutTimes = 5
  const commit = {
    commitId,
    parentId
  }
  const parentCommit = {
    commitId: parentId,
    parentId: grandId
  }
  const grandCommit = {
    commitId: grandId,
    parentId: null
  }

  entity.findById.onFirstCall().returns(commit)
  entity.findById.onSecondCall().returns(parentCommit)
  entity.findById.onThirdCall().returns(grandCommit)

  const commits = await checkout.parents(user, commitId, checkoutTimes)

  t.is(entity.findById.callCount, 3)
  t.deepEqual(commits, [ commit, parentCommit, grandCommit ])
})
