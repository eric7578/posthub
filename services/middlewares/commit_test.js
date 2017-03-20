const test = require('ava')

const knex = require('../../repository/knex')
const repository = require('../../repository')

const commit = require('./commit')(repository)

let root, child

test.before(t => knex.migrate.latest())

test.after(t => knex.migrate.rollback())

test.serial('commit root node', async t => {
  const request = {
    title: 'root commit'
  }
  root = await commit(request)

  t.truthy(root.id)
  t.is(root.title, request.title)
  t.is(root.level, 0)
})

test.serial('commit child node', async t => {
  const request = {
    title: 'child commit',
    parentId: root.id
  }
  child = await commit(request)

  t.truthy(child.id)
  t.is(child.title, request.title)
  t.is(child.level, 1)
})

test.serial('commit child node with inexist parent', async t => {
  const request = {
    title: 'child commit',
    parentId: 0
  }
  const err = await t.throws(commit(request))

  t.is(err.message, 'parent not found')
})
