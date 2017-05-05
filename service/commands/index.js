const fs = require('fs')
const path = require('path')
const glob = require('glob')

module.exports = function (repository = {}) {
  const pattern = path.resolve(__dirname, '!(*_test.js|index.js)')
  const files = glob.sync(pattern)
  const commands = files.reduce((commands, filepath) => {
    const pathObj = path.parse(filepath)
    commands[pathObj.name] = require(filepath)(repository)
    return commands
  }, {})
  return commands
}