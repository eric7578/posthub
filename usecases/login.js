module.exports = repository => async (mail, password) => {
  const { user, encrypt } = repository

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
