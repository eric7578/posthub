const assert = require('assert')

const COMMIT_NOT_FOUND = 'commit not found'

module.exports = repository => {
  const { entity } = repository

  return {
    async checkout (request) {
      const { commitId } = request
      return await entity.findById(commitId)
    },
    async checkoutParent (request) {
      const { commitId } = request
      const found = await entity.findById(commitId)
      assert(found, COMMIT_NOT_FOUND)

      return await entity.findById(found.parentId)
    },
    async checkoutChildren (request) {
      const { commitId } = request
      const parent = await entity.findById(commitId)
      assert(parent, COMMIT_NOT_FOUND)

      const nodes = await entity.findByParentId(parent.id)
      return {
        nodes,
        length: nodes.length
      }
    }
  }
}
