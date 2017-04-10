const assert = require('assert')
const bitop = require('../../utils/bitop')

const PERMISSION_DENIED = 'permission denied'

module.exports = (repository, permits) => {
  const { permission } = repository
  if (!Array.isArray(permits)) {
    permits = Array.prototype.slice.call(arguments, 1)
  }

  return {
    async grant(request, next) {
      const commit = await next()
      await permission.update(request.userId, commit.commitId, permits)
      return commit
    },
    async isGranted(request, next) {
      const isGranted = await permission.update(request.userId, request.commitId, permits)
      assert(isGranted, PERMISSION_DENIED)
      return await next()
    }
  }
}
