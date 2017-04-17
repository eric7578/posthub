const test = require('ava')

const knex = require('../repository/knex')
const repository = require('../repository')

const regist = require('./regist')(repository)
const login = require('./login')(repository)

let user

test.before(async t => {
  await knex.migrate.latest()
  user = await regist({
    mail: 'mail@address.com',
    password: 'pas2w0rd'
  })
})

test.after(async t => {
  await knex.migrate.rollback()
})

test.serial('login with mail/password', async t => {
  const logined = await login({
    mail: 'mail@address.com',
    password: 'pas2w0rd'
  })

  t.is(logined.mail, user.mail)
  t.true(logined.created > 0)
  t.true(logined.logged_in > 0)
})

test.serial('login with not exist mail/password', async t => {
  const error = await t.throws(login({
    mail: 'not_exist@address.com',
    password: 'pas2w0rd'
  }))

  t.is(error.message, 'mail not found')
})

test.serial('login with wrong password', async t => {
  const error = await t.throws(login({
    mail: 'mail@address.com',
    password: 'wrong!'
  }))

  t.is(error.message, 'invalid password')
})
