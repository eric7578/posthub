const assert = require('assert')

const TOKEN_MISSING = 'token missing'
const TOKEN_INVALID = 'token invalid'

module.exports = repository => {
  const { token } = repository

  return {
    exchangeUserId: () => async (request, next) => {
      assert(request.token, TOKEN_MISSING)
      request.userId = await token.exchange(request.token)
      assert(request.userId, TOKEN_INVALID)
      await next
    }
  }
}
