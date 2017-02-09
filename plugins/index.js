const fs = require('fs')
const path = require('path')
const assert = require('assert')

const defaultConfigFile = path.resolve(__dirname, '../plugins.config.js')
const defaultPluginDir = __dirname

let plugins

exports.loadPlugins = function (configFilePath = defaultConfigFile, pluginDirPath = defaultPluginDir) {
  const config = require(configFilePath)

  // load each plugins
  plugins = (config.use || []).map(setting => {
    const pluginName = path.basename(setting.plugin, '.js')
    const pluginFileName = path.format({
      name: pluginName,
      ext: '.js'
    })
    const pluginPath = path.resolve(pluginDirPath, pluginFileName)
    return Object.assign(setting, {
      hooks: require(pluginPath)
    })
  })
}

exports.trigger = function (hook, ...args) {
  assert.ok(plugins, 'call #loadPlugins before trigger hooks')

  hook = transformHookName(hook)
  plugins.forEach(plugin => {
    const hookExist = plugin.hooks.hasOwnProperty(hook)
    if (hookExist) {
      // if hook function exist type should be function
      const fnHook = plugin.hooks[hook]
      const hookFuncType = typeof fnHook
      assert.equal(hookFuncType, 'function', `hook function: ${hook} should be a function, found ${hookFuncType}`)

      fnHook.apply(null, args.concat(plugin.options))
    }
  })
}

exports.transformHookName = function (hook) {
  const hookNameType = typeof hook
  assert.equal(hookNameType, 'string', `hook should be a string, found ${hookNameType}`)

  return hook
    .split('-')
    .map((split, index) => {
      if (index === 0) {
        return split
      }

      return split.charAt(0).toUpperCase() + split.slice(1)
    })
    .join('')
}
