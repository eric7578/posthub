const permission = require('../../repository/permission')
const { illegalOperation } = require('./errors')
const { isset } = require('./bitop')
const { READ, EDIT, CREATOR } = require('./permits')

exports.checkout = exports.checkoutParents = async function (next, user, commitId) {
  const permit = await permission.find(user.userId, commitId)
  if (!permit || !isset(permit, READ)) {
    throw illegalOperation
  }
  return await next
}

exports.commit = async function (next, user, message, parentId) {
  if (parentId) {
    const permit = await permission.find(user.userId, parentId)
    if (!permit || !isset(permit, EDIT)) {
      throw illegalOperation
    }
  }
  const createdCommit = await next
  await permission.update(user.userId, createdCommit.commitId, CREATOR)
  return createdCommit
}

exports.rebase = async function (next, user, commitId, parentId) {
  const permit = await permission.find(user.userId, commitId)
  if (!permit || !isset(permit, EDIT)) {
    throw illegalOperation
  }
  return await next 
}
