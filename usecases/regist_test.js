const test = require('ava')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')

test.beforeEach(t => {
  const user = {
    findByMail: stub(),
    create: stub()
  }
  const encrypt = {
    hash: stub()
  }
  t.context = {
    user,
    encrypt,
    usecases: proxyquire('./regist', {
      '../repository/user': user,
      '../repository/encrypt': encrypt
    })
  }
})

test('regist with mail and password', async t => {
  const { user, encrypt, usecases } = t.context
  const mail = 'user@mail.com'
  const password = 'password'
  const hashPassword = 'pa2svv0rd'
  const createdUser = {
    userId: 1
  }

  user.findByMail.returns(null)
  user.create.returns(createdUser)
  encrypt.hash.returns(hashPassword)

  const regsitedUser = await usecases.registMailUser(mail, password)

  t.true(user.findByMail.calledWithExactly(mail))
  t.true(encrypt.hash.calledWithExactly(password))
  t.true(user.create.calledWithExactly(mail, hashPassword))
  t.deepEqual(regsitedUser, createdUser)
})

test('regist with exist mail', async t => {
  const { user, encrypt, usecases } = t.context
  const mail = 'user@mail.com'
  const password = 'password'
  const hashPassword = 'pa2svv0rd'
  const existedUser = {
    userId: 1
  }

  user.findByMail.returns(existedUser)

  t.throws(usecases.registMailUser(mail, password), 'mail exist')
})
