const test = require('ava')

const knex = require('../repository/knex')
const repository = require('../repository')
const mongoose = require('../repository/mongoose')

const regist = require('./regist')(repository)
const mail = 'mail@address.com'
const password = 'pas2w0rd'

test.before(async t => {
  await mongoose.connect()
})

test.serial('regist with mail/password', async t => {
  const request = {
    mail,
    password
  }
  const user = await regist(request)

  t.is(user.mailIdentity.mail, request.mail)
  t.true(user.isMailUser)
  t.true(user.createAt.getTime() > 0)
  t.true(user.lastLoginAt.getTime() > 0)
})

test.serial('regist with exist mail', async t => {
  const request = {
    mail,
    password
  }
  const error = await t.throws(regist(request))

  t.is(error.message, 'mail exist')
})
