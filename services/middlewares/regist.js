const assert = require('assert')

const MAIL_EXIST = 'mail exist'

module.exports = repository => async request => {
  const { user, encrypt } = repository
  const { mail, password } = request

  const existedUser = await user.findByMail(mail)
  assert(!existedUser, MAIL_EXIST)

  const hashPassword = await encrypt.hash(password)
  const mailUser = await user.create(mail, hashPassword)

  return {
    id: mailUser.id,
    mail: mailUser.mail,
    created: mailUser.createAt,
    logged_in: mailUser.lastLoginAt
  }
}
