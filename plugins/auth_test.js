const test = require('ava')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')
const { CREATOR } = require('./auth')

test.beforeEach(t => {
  const permission = {
    update: stub()
  }
  t.context = {
    permission,
    plugin: proxyquire('./auth', {
      '../repository/permission': permission
    })
  }
})

test('grant user for permission when on create hook', async t => {
  const { plugin, permission } = t.context
  const commit = {
    commitId: 'commitId',
    creatorId: 'creatorId'
  }

  await plugin.create(commit)

  t.true(permission.update.calledWithExactly(commit.creatorId, commit.commitId, CREATOR))
})
