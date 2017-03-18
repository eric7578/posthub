const assert = require('assert')

const COMMIT_NOT_FOUND = 'commit not found'
const PARENT_NOT_FOUND = 'parent not found'

module.exports = repository => {
  const { entity } = repository

  return {
    async commit(request) {
      const { token, title, parentId } = request

      if (request.hasOwnProperty('parentId')) {
        const parent = await entity.findById(parentId)
        assert(parent, PARENT_NOT_FOUND)

        return await entity.create(title, parent.id, parent.level + 1)
      } else {
        return await entity.createRoot(title)
      }
    },
    async checkout(request) {
      const { token, commitId } = request
      return await entity.findById(commitId)
    },
    async checkoutParent(request) {
      const { token, commitId } = request
      const found = await entity.findById(commitId)
      assert(found, COMMIT_NOT_FOUND)

      return await entity.findById(found.parentId)
    },
    async checkoutChildren(request) {
      const { token, commitId } = request
      const parent = await entity.findById(commitId)
      assert(parent, COMMIT_NOT_FOUND)

      return await entity.findByParentId(parent.id)
    },
    async rebase(request) {
      const { token, commitId, targetId } = request
      assert(await entity.exists(commitId), 'commit not found')
      assert(await entity.exists(targetId), 'rebase target not found')

      assert(await entity.update(commitId, { parentId: targetId }), 'rebase failed')
      return await entity.findById(commitId)
    }
  }
}
