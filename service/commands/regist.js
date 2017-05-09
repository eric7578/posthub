const assert = require('assert')

const MAIL_EXIST = 'mail exist'

module.exports = repository => async request => {
  const { User } = repository.user
  const { mail, password } = request

  const existedUsers = await User.find().byMail(mail)
  assert(existedUsers.length === 0, MAIL_EXIST)

  const user = await User.create({
    mailIdentity: {
      mail, 
      password
    }
  })

  return user.toJSON()
}
