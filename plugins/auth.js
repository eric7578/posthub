const permission = require('../repository/permission')

exports.READ = 0
exports.EDIT = 1
exports.REMOVE = 2
exports.CREATOR = [exports.READ, exports.EDIT, exports.REMOVE]

exports.create = async function (commit) {
  const { creatorId, commitId } = commit
  return await permission.update(creatorId, commitId, exports.CREATOR)
}

exports.listCommitPermission = async function (commitId) {
  const permissions = await permission.findByCommitId(commitId)
  return permissions.filter(p => p.permission > 0)
}

exports.listUserPermission = async function (userId) {
  const permissions = await permission.findByUserId(userId)
  return permissions.filter(p => p.permission > 0)
}
