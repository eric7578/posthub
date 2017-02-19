const path = require('path')
const globSync = require('glob/sync')

const { loadFromConfig } = require('./_hooks/config')
const binding = require('./_hooks/binding')

const plugins = loadFromConfig()

module.exports = globSync('usecases/!(*_test|index).js')
  .reduce((usecases, usecasePath) => {
    usecasePath = path.resolve(process.cwd(), usecasePath)
    const { name } = path.parse(usecasePath)
    const module = require(usecasePath)
    const bindingModule = binding(name, module, plugins)

    return Object.defineProperty(usecases, name, {
      get: () => bindingModule
    })
  }, {})
