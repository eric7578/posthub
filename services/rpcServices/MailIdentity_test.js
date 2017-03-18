const test = require('ava')

const knex = require('../../repository/knex')

const MailIdentity = require('./MailIdentity')({
  user: require('../../repository/user'),
  encrypt: require('../../repository/encrypt'),
  token: require('../../repository/token')
})

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
  const user = await MailIdentity.regist(request)

  t.is(user.mail, request.mail)
  t.true(user.created > 0)
  t.true(user.logged_in > 0)
  t.truthy(user.token)
})

test.serial('regist with exist mail', async t => {
  const request = {
    mail: 'mail@address.com',
    password: 'pas2w0rd'
  }
  const error = await t.throws(MailIdentity.regist(request))

  t.is(error.message, 'mail exist')
})

test.serial('login with mail/password', async t => {
  const request = {
    mail: 'mail@address.com',
    password: 'pas2w0rd'
  }
  const user = await MailIdentity.login(request)

  t.is(user.mail, request.mail)
  t.true(user.created > 0)
  t.true(user.logged_in > 0)
  t.truthy(user.token)
})

test.serial('login with not exist mail/password', async t => {
  const request = {
    mail: 'not_exist@address.com',
    password: 'pas2w0rd'
  }
  const error = await t.throws(MailIdentity.login(request))

  t.is(error.message, 'mail not found')
})

test.serial('login with wrong password', async t => {
  const request = {
    mail: 'mail@address.com',
    password: 'wrong!'
  }
  const error = await t.throws(MailIdentity.login(request))

  t.is(error.message, 'invalid password')
})
