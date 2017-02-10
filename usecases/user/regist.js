const user = require('../../repository/user')
const encrypt = require('../../repository/encrypt')

module.exports = async function (mail, password) {
  const existedUser = await user.findByMail(mail)
  if (existedUser) {
    throw new Error('mail exist')
  }

  const hashPassword = await encrypt.hash(password)
  const mailUser = await user.create(mail, hashPassword)
  return mailUser
}
