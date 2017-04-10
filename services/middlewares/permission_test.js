const test = require('ava')
const sinon = require('sinon')

const knex = require('../../repository/knex')
const repository = require('../../repository')
const { CREATOR } = require('./permits')

const regist = require('../commands/regist')(repository)
const commit = require('../commands/commit')(repository)
const creatorPermission = require('./permission')(repository, CREATOR)

let root
let creator, stranger
let grantCreator, isCreator
test.before(async t => {
  await knex.migrate.latest()
  creator = await regist({
    mail: 'creator@address.com',
    password: 'pas2w0rd'
  })
  stranger = await regist({
    mail: 'stranger@address.com',
    password: 'pas2w0rd'
  })
  root = await commit({
    title: 'commit title'
  })

  await creatorPermission.grant({
    title: 'commit title',
    userId: creator.id
  }, sinon.stub().resolves(root))
})

test.after(async t => {
  await knex.migrate.rollback()
})

test('allow following process with permitted user', async t => {
  const next = sinon.spy()
  await creatorPermission.isGranted({
    userId: creator.id,
    parentId: root.id
  }, next)

  t.true(next.calledOnce)
})

test('disallow following process with non-permitted user', async t => {
  const next = sinon.spy()
  await creatorPermission.isGranted({
    userId: stranger.id,
    parentId: root.id
  }, next)

  t.false(next.calledOnce)
})
