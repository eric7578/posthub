const test = require('ava')

const knex = require('../../repository/knex')
const repository = require('../../repository')

const regist = require('./regist')(repository)

test.before(async t => {
  await knex.migrate.latest()
})

test.after(async t => {
  await knex.migrate.rollback()
})

test.serial('regist with mail/password', async t => {
  const request = {
    mail: 'mail@address.com',
    password: 'pas2w0rd'
  }
  const user = await regist(request)

  t.is(user.mail, request.mail)
  t.true(user.created > 0)
  t.true(user.logged_in > 0)
})

test.serial('regist with exist mail', async t => {
  const request = {
    mail: 'mail@address.com',
    password: 'pas2w0rd'
  }
  const error = await t.throws(regist(request))

  t.is(error.message, 'mail exist')
})
