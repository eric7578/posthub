module.exports = function () {
  return function (doc, ret, options) {
    delete ret._id
    delete ret.__v
  }
}