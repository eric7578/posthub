const assert = require('assert')

const TOKEN_MISSING = 'token missing'
const TOKEN_INVALID = 'token invalid'

module.exports = repository => {
  const { token } = repository

  return {
    async encode(request, next) {
      const user = await next
      const userToken = await token.generate(user)
      return Object.assign(user, { token: userToken })
    },
    async decode(request, next) {
      assert(request.token, TOKEN_MISSING)
      request.userId = await token.exchange(request.token)
      assert(request.userId, TOKEN_INVALID)
      return await next
    }
  }
}
