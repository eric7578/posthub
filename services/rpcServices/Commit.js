const assert = require('assert')

module.exports = repository => {
  const { entity } = repository

  return {
    async commit(request) {
      const { token, title, parentId } = request

      if (request.hasOwnProperty('parentId')) {
        const parent = await entity.findById(parentId)
        assert.ok(parent, 'parent not found')

        return await entity.create(title, parent.id, parent.level + 1)
      } else {
        return await entity.createRoot(title)
      }
    },
    async checkout(request) {
      const { token, commitId } = request
      const found = await entity.findById(commitId)
      assert.ok(found, 'commit not found')

      return found
    }
  }
}
