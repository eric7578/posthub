const mongoose = require('mongoose')
mongoose.Promise = Promise

if (process.env.NODE_ENV === 'test') {
  const { Mockgoose } = require('mockgoose')
  let mockgoose = null

  module.exports = {
    async connect () {
      mockgoose = new Mockgoose(mongoose)
      await mockgoose.prepareStorage()
      await mongoose.connect('mongodb://projecthub.org/testdb')
    },
    async reset () {
      if (mockgoose) {
        await mockgoose.helper.reset()
      } else {
        await this.connect()
      }
    }
  }
} else {
  module.exports = mongoose
}