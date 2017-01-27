const test = require('ava')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')

test.beforeEach(t => {
  const user = {
    findByMail: stub()
  }
  const encrypt = {
    isEqual: stub()
  }
  t.context = {
    user,
    encrypt,
    usecases: proxyquire('./login', {
      '../repository/user': user,
      '../repository/encrypt': encrypt
    })
  }
})

test('login mail user', async t => {
  const { user, encrypt, usecases } = t.context
  const mail = 'user@mail.com'
  const password = 'password'
  const hashPassword = 'pa2svv0rd'
  const existUser = {
    mail,
    password: hashPassword
  }

  user.findByMail.returns(existUser)
  encrypt.isEqual.returns(true)
  const loginUser = await usecases.loginMailUser(mail, password)

  t.true(user.findByMail.calledOnce)
  t.true(user.findByMail.calledWithExactly(mail))
  t.true(encrypt.isEqual.calledOnce)
  t.true(encrypt.isEqual.calledWithExactly(password, existUser.password))
  t.deepEqual(loginUser, existUser)
})

test('login mail user with wrong password', async t => {
  const { user, encrypt, usecases } = t.context
  const mail = 'user@mail.com'
  const wrongPassword = 'wrong-password'
  const hashPassword = 'pa2svv0rd'
  const existUser = {
    mail,
    password: hashPassword
  }

  user.findByMail.returns(existUser)
  encrypt.isEqual.returns(false)

  t.throws(usecases.loginMailUser(mail, wrongPassword), 'invalid password')
})

test('login mail user with not exist mail', async t => {
  const { user, usecases } = t.context
  const mail = 'not-exist@mail.com'
  const password = 'password'

  user.findByMail.returns(null)

  t.throws(usecases.loginMailUser(mail, password), 'invalid mail')
})
