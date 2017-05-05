const test = require('ava')

const knex = require('../repository/knex')
const repository = require('../repository')

const regist = require('./regist')(repository)
const { encode, decode } = require('./tokenizer')(repository)

let user, encodedUser

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

test.serial('encode userId to token', async t => {
  const request = {}
  const next = Promise.resolve(user)

  encodedUser = await encode(request, next)

  t.truthy(encodedUser.token)
  t.is(typeof encodedUser.token, 'string')
})

test.serial('decode token to userId', async t => {
  const request = encodedUser
  const next = Promise.resolve()

  delete request.userId
  await decode(request, next)

  t.truthy(request.userId)
  t.is(request.userId, user.userId)
})
