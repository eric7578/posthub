const test = require('ava')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')

const { READ, EDIT, CREATOR } = require('./permits')
const { set } = require('./bitop')
const { illegalOperation } = require('./errors')

test.beforeEach(t => {
  const permission = {
    find: stub(),
    update: stub()
  }
  t.context = {
    permission,
    index: proxyquire('./index', {
      '../../repository/permission': permission
    })
  }
})

test('checkout read permit before checkout usecases', async t => {
  const { index, permission } = t.context
  const next = Promise.resolve()
  const user = { userId: 'userId' }
  const commitId = 'commitId'
  permission.find.returns(set(0, READ))

  await index.checkout(next, user, commitId)

  t.true(permission.find.calledWithExactly(user.userId, commitId))
})

test('throw illegalOperation if read permit is denied during checkout', async t => {
  const { index, permission } = t.context
  const next = Promise.resolve()
  const user = { userId: 'userId' }
  const commitId = 'commitId'
  permission.find.returns(0)

  t.throws(index.checkout(next, user, commitId), 'illegalOperation')
})

test('check edit permit if parentId is provided during commit', async t => {
  const { index, permission } = t.context
  const next = Promise.resolve({
    commitId: 'createdCommitId'
  })
  const user = { userId: 'userId' }
  const message = 'message'
  const parentId = 'parentId'
  permission.find.returns(set(0, EDIT))

  await index.commit(next, user, message, parentId)

  t.true(permission.find.calledWithExactly(user.userId, parentId))
  t.true(permission.update.calledWithExactly(user.userId, 'createdCommitId', CREATOR))
})

test('skip check edit permit if parentId is not provided during commit', async t => {
  const { index, permission } = t.context
  const next = Promise.resolve({
    commitId: 'createdCommitId'
  })
  const user = { userId: 'userId' }
  const message = 'message'
  permission.find.returns(set(0, EDIT))

  await index.commit(next, user, message)

  t.false(permission.find.called)
  t.true(permission.update.calledWithExactly(user.userId, 'createdCommitId', CREATOR))
})

test('throw illegalOperation if edit permit is denied during commit', t => {
  const { index, permission } = t.context
  const next = Promise.resolve({
    commitId: 'createdCommitId'
  })
  const user = { userId: 'userId' }
  const message = 'message'
  const parentId = 'parentId'
  permission.find.returns(0)

  t.throws(index.commit(next, user, message, parentId), 'illegalOperation')
})

test('throw illegalOperation if edit permit is denied during rebase', async t => {
  const { index, permission } = t.context
  const next = Promise.resolve()
  const user = { userId: 'userId' }
  const commitId = 'commitId'
  const parentId = 'parentId'
  permission.find.returns(0)

  t.throws(index.rebase(next, user, commitId, parentId), 'illegalOperation')
})
