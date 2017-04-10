const test = require('ava')

const knex = require('../../repository/knex')
const repository = require('../../repository')

const commit = require('./commit')(repository)
const { checkout, checkoutParent, checkoutChildren } = require('./checkout')(repository)

let root, child

test.before(async t => {
  await knex.migrate.latest()
  root = await commit({ title: 'root commit' })
  child = await commit({ title: 'child commit', parentId: root.id })
})

test.after(t => knex.migrate.rollback())

test.serial('checkout exist node', async t => {
  const found = await checkout({ commitId: child.id })
  t.deepEqual(found, child)
})

test.serial('checkout inexist node', async t => {
  const found = await checkout({ commitId: 0 })
  t.falsy(found)
})

test.serial(`checkout node's parent`, async t => {
  const parent = await checkoutParent({ commitId: child.id })
  t.deepEqual(parent, root)
})

test.serial(`checkout root node's parent`, async t => {
  const parent = await checkoutParent({ commitId: root.id })
  t.falsy(parent)
})

test.serial(`checkout parent's children`, async t => {
  const children = await checkoutChildren({ commitId: root.id })
  t.deepEqual(children, {
    length: 1,
    nodes: [child]
  })
})
