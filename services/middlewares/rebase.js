const assert = require('assert')

const COMMIT_NOT_FOUND = 'commit not found'
const REBASE_TARGET_NOT_FOUND = 'rebase target not found'
const REBASE_FAILED = 'rebase failed'

module.exports = repository => async request => {
  const { entity } = repository
  const { commitId, targetId } = request

  assert(await entity.exists(commitId), COMMIT_NOT_FOUND)
  assert(await entity.exists(targetId), REBASE_TARGET_NOT_FOUND)

  assert(await entity.update(commitId, { parentId: targetId }), REBASE_FAILED)
  return await entity.findById(commitId)
}
