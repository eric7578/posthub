const entity = require('../../repository/entity')

module.exports = async function (commitId) {
  return await entity.findById(commitId)
}

module.exports.parents = async function (commitId, checkoutTimes) {
  const commits = []
  const limitedByTimes = arguments.length === 2

  while (!limitedByTimes || limitedByTimes && checkoutTimes-- > 0) {
    const commit = await entity.findById(commitId)
    commits.push(commit)

    if (commit.parentId) {
      commitId = commit.parentId
    } else {
      break
    }
  }

  return commits
}
