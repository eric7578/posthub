const test = require('ava')

const knex = require('../../repository/knex')
const repository = require('../../repository')

const commit = require('./commit')(repository)
const rebase = require('./rebase')(repository)
const { checkoutChildren } = require('./checkout')(repository)

let root, nextRoot, child

test.before(async t => {
  await knex.migrate.latest()
  root = await commit({ title: 'root commit' })
  nextRoot = await commit({ title: 'next root commit' })
  child = await commit({ title: 'child commit', parentId: root.id })
})

test.after(t => knex.migrate.rollback())

test.serial('rebase child from root to nextRoot', async t => {
  const rebased = await rebase({ commitId: child.id, targetId: nextRoot.id })
  const childrenOfOldRoot = await checkoutChildren({ commitId: root.id })
  const childrenOfNextRoot = await checkoutChildren({ commitId: nextRoot.id })

  t.deepEqual(rebased, Object.assign(child, {
    parentId: nextRoot.id
  }))
  t.deepEqual(childrenOfOldRoot, {
    length: 0,
    nodes: []
  })
  t.deepEqual(childrenOfNextRoot, {
    length: 1,
    nodes: [child]
  })
})
