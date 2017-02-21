const entity = require('../repository/entity')

module.exports = async function (user, commitId, parentId) {
  const [commit, parent] = await Promise.all([
    entity.findById(commitId),
    entity.findById(parentId)
  ])

  if (!commit || !parent) {
    throw new Error('commitNotFound')
  }

  if (commit.level !== parent.level + 1) {
    throw new Error('levelNotMatch')
  }

  await entity.updateParent(commitId, parentId)
}
