const path = require('path')
const apply = require('./apply')
const strings = require('../../utils/strings')

module.exports = function (moduleName, module, plugins) {
  let bindingModule = {}

  // binding default method
  if (needDynamicBinding(module)) {
    bindingModule = apply(module, plugins[moduleName])
  }

  // all other props
  Object
    .keys(module)
    .forEach(prop => {
      if (needDynamicBinding(module[prop])) {
        const name = strings.toCamelCase(moduleName, prop)
        bindingModule[prop] = apply(module[prop], plugins[name])
      } else {
        bindingModule[prop] = module[prop]
      }
    })

  return bindingModule
}

function needDynamicBinding(val) {
  return typeof val === 'function'
}
