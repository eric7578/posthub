const user = require('../repository/user')
const encrypt = require('../repository/encrypt')

module.exports = repository => async (mail, password) => {
  const { user, encrypt } = repository

  const existedUser = await user.findByMail(mail)
  if (existedUser) {
    throw new Error('mail exist')
  }

  const hashPassword = await encrypt.hash(password)
  const mailUser = await user.create(mail, hashPassword)
  return mailUser
}
