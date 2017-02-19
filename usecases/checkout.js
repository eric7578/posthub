const entity = require('../repository/entity')

module.exports = async function (user, commitId) {
  return await entity.findById(commitId)
}

module.exports.parents = async function (user, commitId, checkoutTimes) {
  const commits = []
  const limitedByTimes = checkoutTimes > 0

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
