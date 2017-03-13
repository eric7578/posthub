const { regist, token, login } = require('../usecases')

const MailIdentity = {
  async login(call, callback) {
    const { mail, password } = call.request
    try {
      const user = await login(mail, password)
      const accessToken = await token.getToken(user)
      callback(null, {
        token: accessToken,
        created: user.createAt,
        logged_in: user.lastLoginAt,
        mail: user.mail
      })
    } catch (err) {
      callback(err)
    }
  },
  async regist(call, callback) {
    const { mail, password } = call.request
    try {
      const user = await regist(mail, password)
      const accessToken = await token.getToken(user)
      callback(null, {
        token: accessToken,
        created: user.createAt,
        logged_in: user.lastLoginAt,
        mail: user.mail
      })
    } catch (err) {
      callback(err)
    }
  }
}

module.exports = {
  MailIdentity
}
