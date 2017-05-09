const assert = require('assert')

const PARENT_NOT_FOUND = 'parent not found'

module.exports = repository => async request => {
  const { Entity } = repository.entity
  const { title, parentId } = request
  let entity

  if (request.hasOwnProperty('parentId')) {
    const parent = await Entity.findById(parentId)
    assert(parent, PARENT_NOT_FOUND)

    entity = await Entity.create({
      title, 
      parentId: parent.id,
      level: parent.level + 1
    })
  } else {
    entity = await Entity.create({
      title
    })
  }

  return entity.toJSON()
}
