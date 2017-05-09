const mongoose = require('mongoose')
const toJSONTransform = require('./toJSONTransform')

const entitySchema = new mongoose.Schema({
  parentId: mongoose.Schema.Types.ObjectId,
  level: {
    type: Number,
    default: 0,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  }
})

entitySchema.set('toJSON', {
  virtuals: true,
  transform: toJSONTransform()
})

entitySchema.query.byParentId = async function (parentId) {
  return this.find({
    parentId
  })
}

exports.Entity = mongoose.model('Entity', entitySchema)
