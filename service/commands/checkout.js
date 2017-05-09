const assert = require('assert')

const COMMIT_NOT_FOUND = 'commit not found'

module.exports = repository => {
  const { Entity } = repository.entity

  return {
    async checkout (request) {
      const { commitId } = request
      const entity = await Entity.findById(commitId)
      return entity && entity.toJSON()
    },
    async checkoutParent (request) {
      const { commitId } = request
      const commit = await Entity.findById(commitId)
      assert(commit, COMMIT_NOT_FOUND)

      const parent = await Entity.findById(commit.parentId)
      return parent && parent.toJSON()
    },
    async checkoutChildren (request) {
      const { commitId } = request
      const parent = await Entity.findById(commitId)
      assert(parent, COMMIT_NOT_FOUND)

      const nodes = await Entity.find().byParentId(parent.id)
      return nodes.map(node => node.toJSON())
    }
  }
}
