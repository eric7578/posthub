const assert = require('assert')
const bitop = require('../../utils/bitop')

module.exports = (repository, defaultPermits) => {
  const { permission } = repository
  const PERMISSION_DENIED = 'permission denied'

  if (!Array.isArray(defaultPermits)) {
    defaultPermits = Array.prototype.slice.call(arguments, 1)
  }

  return class Permission {
    async apply(service) {
      console.log(service)
      this._setupCommit(service)
    }

    _setupCommit(service) {
      service.plugin('after-commands', commands => {
        commands.plugin('commit', commit => {
          commit.plugin('before-execute', async context => {
            if (context.parentId) {
              const isGranted = await permission.update(context.userId, context.commitId, permits)
              assert(isGranted, PERMISSION_DENIED)
            }
          })
          commit.plugin('after-execute', async context => {
            // const permits = defaultPermits.concat(context.permits
            // await permission.update(context.userId, context.commitId, permits)
          })
        })
      })
    }
  }
}
