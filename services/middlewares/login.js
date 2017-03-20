const assert = require('assert')

module.exports = repository => async request => {
  const { user, encrypt, token } = repository
  const { mail, password } = request
  const mailUser = await user.findByMail(mail)
  assert.ok(mailUser, 'mail not found')

  const isPasswordCorrect = await encrypt.isEqual(password, mailUser.password)
  assert(isPasswordCorrect, 'invalid password')

  const accessToken = await token.generate(mailUser)

  return {
    token: accessToken,
    mail: mailUser.mail,
    created: mailUser.createAt,
    logged_in: mailUser.lastLoginAt
  }
}
