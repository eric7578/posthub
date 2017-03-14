const test = require('ava')
const { spy } = require('sinon')
const proxyquire = require('proxyquire')

const knex = require('../repository/knex')
const user = require('./user')

const repository = {
  user: require('../repository/user'),
  encrypt: require('../repository/encrypt')
}

const mailIdentity = user.mailIdentity({
  regist: require('../usecases/regist')(repository),
  login: require('../usecases/login')(repository),
  token: require('../usecases/token')(repository)
})

test.before(async t => {
  await knex.migrate.latest()
})

test.after(async t => {
  await knex.migrate.rollback()
})

test.serial('regist with mail/password', async t => {
  const call = {
    request: {
      mail: 'mail@address.com',
      password: 'pas2w0rd'
    }
  }
  const callback = spy()
  await mailIdentity.regist(call, callback)

  const args = callback.args[0]
  t.falsy(args[0])
  t.is(args[1].mail, call.request.mail)
  t.truthy(args[1].token)
})

test.serial('regist with exist mail', async t => {
  const call = {
    request: {
      mail: 'mail@address.com',
      password: 'pas2w0rd'
    }
  }
  const callback = spy()
  await mailIdentity.regist(call, callback)

  const args = callback.args[0]
  t.is(args[0].message, 'mail exist')
  t.falsy(args[1])
})

test.serial('login with mail/password', async t => {
  const call = {
    request: {
      mail: 'mail@address.com',
      password: 'pas2w0rd'
    }
  }
  const callback = spy()
  await mailIdentity.login(call, callback)

  const args = callback.args[0]
  t.falsy(args[0])
  t.is(args[1].mail, call.request.mail)
  t.truthy(args[1].token)
})

test.serial('login with not exist mail/password', async t => {
  const call = {
    request: {
      mail: 'not_exist@address.com',
      password: 'pas2w0rd'
    }
  }
  const callback = spy()
  await mailIdentity.login(call, callback)

  const args = callback.args[0]
  t.is(args[0].message, 'invalid mail')
  t.falsy(args[1])
})

test.serial('login with wrong password', async t => {
  const call = {
    request: {
      mail: 'mail@address.com',
      password: 'wrong!'
    }
  }
  const callback = spy()
  await mailIdentity.login(call, callback)

  const args = callback.args[0]
  t.is(args[0].message, 'invalid password')
  t.falsy(args[1])
})
