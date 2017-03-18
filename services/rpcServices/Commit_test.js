const test = require('ava')

const knex = require('../../repository/knex')

const MailIdentity = require('./MailIdentity')({
  user: require('../../repository/user'),
  encrypt: require('../../repository/encrypt'),
  token: require('../../repository/token')
})

const Commit = require('./Commit')({
  entity: require('../../repository/entity')
})

let user
let root, child
test.before(async t => {
  await knex.migrate.latest()
  user = await MailIdentity.regist({
    mail: 'mail@address.com',
    password: 'pas2w0rd'
  })
})

test.after(async t => {
  await knex.migrate.rollback()
})

test.serial('commit root node', async t => {
  const request = {
    token: user.token,
    title: 'root commit'
  }
  root = await Commit.commit(request)

  t.truthy(root.id)
  t.is(root.title, request.title)
  t.is(root.level, 0)
})

test.serial('commit child node', async t => {
  const request = {
    token: user.token,
    title: 'child commit',
    parentId: root.id
  }
  child = await Commit.commit(request)

  t.truthy(child.id)
  t.is(child.title, request.title)
  t.is(child.level, 1)
})

test.serial('commit child node with inexist parent', async t => {
  const request = {
    token: user.token,
    title: 'child commit',
    parentId: 0
  }
  const err = await t.throws(Commit.commit(request))

  t.is(err.message, 'parent not found')
})

test.serial('checkout exist node', async t => {
  const request = {
    token: user.token,
    commitId: child.id
  }
  const found = await Commit.checkout(request)

  t.deepEqual(found, child)
})

test.serial('checkout inexist node', async t => {
  const request = {
    token: user.token,
    commitId: 0
  }
  const found = await Commit.checkout(request)

  t.falsy(found)
})

test.serial(`checkout node's parent`, async t => {
  const request = {
    token: user.token,
    commitId: child.id
  }
  const parent = await Commit.checkoutParent(request)

  t.deepEqual(parent, root)
})

test.serial(`checkout root node's parent`, async t => {
  const request = {
    token: user.token,
    commitId: root.id
  }
  const parent = await Commit.checkoutParent(request)

  t.falsy(parent)
})

test.serial(`checkout parent's children`, async t => {
  const request = {
    token: user.token,
    commitId: root.id
  }
  const children = await Commit.checkoutChildren(request)

  t.deepEqual(children, [child])
})
