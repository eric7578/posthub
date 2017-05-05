const repository = require('./repository')
const commands = require('./commands')(repository)
const Service = require('./Service')

module.exports = new Service({
  commands
})