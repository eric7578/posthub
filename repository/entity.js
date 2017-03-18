const knex = require('./knex')

exports.findById = async id => {
  const entities = await knex
    .select('*')
    .from('entities')
    .where('id', '=', id)
  return entities[0]
}

exports.createRoot = async title => {
  const level = 0
  const [id] = await knex
    .insert({
      title,
      level
    })
    .into('entities')

  return {
    id,
    parentId: null,
    title,
    level
  }
}

exports.create = async (title, parentId, level) => {
  const [id] = await knex
    .insert({
      parentId,
      title,
      level
    })
    .into('entities')

  return {
    id,
    parentId,
    title,
    level
  }
}

exports.findByParentId = async (parentId) => {
  return knex
    .select('*')
    .from('entities')
    .where('parentId', '=', parentId)
}

exports.update = async (commitId, fields) => {
  const numAffected = await knex
    .update(fields)
    .from('entities')
    .where('id', '=', commitId)
  return numAffected === 1
}

exports.exists = async commitId => {
  const entities = await knex
    .select('id')
    .from('entities')
    .where('id', '=', commitId)
  return entities.length > 0
}
