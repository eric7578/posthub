const assert = require('assert')

const PARENT_NOT_FOUND = 'parent not found'

module.exports = repository => async request => {
  const { entity } = repository
  const { title, parentId } = request

  if (request.hasOwnProperty('parentId')) {
    const parent = await entity.findById(parentId)
    assert(parent, PARENT_NOT_FOUND)

    return await entity.create(title, parent.id, parent.level + 1)
  } else {
    return await entity.createRoot(title)
  }
}
