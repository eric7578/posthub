const user = require('../../repository/user')
const encrypt = require('../../repository/encrypt')

module.exports = async function (mail, password) {
  const mailUser = await user.findByMail(mail)
  if (!mailUser) {
    throw new Error('invalid mail')
  }

  const isPasswordCorrect = await encrypt.isEqual(password, mailUser.password)
  if (!isPasswordCorrect) {
    throw new Error('invalid password')
  }

  return mailUser
}
