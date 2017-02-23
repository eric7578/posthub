const path = require('path')

exports.loadFromConfig = function () {
  const cwd = process.cwd()
  const configPath = path.resolve(cwd, 'plugins.config.js')
  const config = require(configPath)

  const pluginsDir = path.resolve(cwd, 'plugins')
  const pluginPathes = config.use
    .map(setting => {
      const dir = typeof setting === 'string' ? setting : setting.plugin
      return path.resolve(pluginsDir, dir, 'hooks')
    })

  return aggregatePlugins(pluginPathes)
}

function aggregatePlugins(pluginPathes) {
  return pluginPathes
    .map(pluginPath => require(pluginPath))
    .reduce((plugins, module) => {
      return Object.keys(module)
        .filter(method => typeof module[method] === 'function')
        .reduce((plugins, method) => {
          const pluginMethod = module[method]
          if (Array.isArray(plugins[method])) {
            plugins[method].push(pluginMethod)
          } else {
            plugins[method] = [pluginMethod]
          }
          return plugins
        }, plugins)
    }, {})
}
