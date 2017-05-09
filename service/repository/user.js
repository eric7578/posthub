const mongoose = require('mongoose')
const toJSONTransform = require('./toJSONTransform')

const mailIdentitySchema = new mongoose.Schema({
  mail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

mailIdentitySchema.set('toJSON', {
  virtuals: true,
  transform: toJSONTransform()
})

const userSchema = new mongoose.Schema({
  createAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  mailIdentity: mailIdentitySchema
})

userSchema.set('toJSON', {
  virtuals: true,
  transform: toJSONTransform()
})

userSchema.query.byMail = function (mail) {
  return this.find({
    'mailIdentity.mail': mail
  })
}

userSchema.virtual('isMailUser').get(function () {
  return !!this.mailIdentity
})

exports.User = mongoose.model('User', userSchema)