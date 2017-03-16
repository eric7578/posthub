module.exports = repository => {
  const { user, encrypt, token } = repository

  return {
    async login(request) {
      const { mail, password } = request
      const mailUser = await user.findByMail(mail)
      if (!mailUser) {
        throw new Error('invalid mail')
      }

      const isPasswordCorrect = await encrypt.isEqual(password, mailUser.password)
      if (!isPasswordCorrect) {
        throw new Error('invalid password')
      }
      const accessToken = await token.generate(mailUser)

      return {
        token: accessToken,
        mail: mailUser.mail,
        created: mailUser.createAt,
        logged_in: mailUser.lastLoginAt
      }
    },
    async regist(request) {
      const { mail, password } = request

      const existedUser = await user.findByMail(mail)
      if (existedUser) {
        throw new Error('mail exist')
      }

      const hashPassword = await encrypt.hash(password)
      const mailUser = await user.create(mail, hashPassword)
      const accessToken = await token.generate(mailUser)

      return {
        token: accessToken,
        mail: mailUser.mail,
        created: mailUser.createAt,
        logged_in: mailUser.lastLoginAt
      }
    }
  }
}
