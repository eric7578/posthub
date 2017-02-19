const entity = require('../repository/entity')

module.exports = async function (message, parentId) {
  if (parentId) {
    const parent = await entity.findById(parentId)
    if (!parent) {
      throw new Error('parent not exist')
    }

    return await entity.create(message, parentId)
  } else {
    return await entity.createRoot(message)
  }
}

module.exports.sub = async function () {
  console.log('makeSub')
}
