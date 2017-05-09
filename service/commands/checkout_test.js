const test = require('ava')
const mongoose = require('../repository/mongoose')
const repository = require('../repository')

const commit = require('./commit')(repository)
const { checkout, checkoutParent, checkoutChildren } = require('./checkout')(repository)

let root, child

test.before(async t => {
  await mongoose.reset()
  root = await commit({ title: 'root commit' })
  child = await commit({ title: 'child commit', parentId: root.id })
})

test.serial('checkout exist node', async t => {
  const found = await checkout({ commitId: child.id })
  t.deepEqual(found, child)
})

test.serial('checkout inexist node', async t => {
  const found = await checkout({
    commitId: new require('mongoose').Schema.Types.ObjectId()
  })
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
  t.deepEqual(children, [child])
})
