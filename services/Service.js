const fs = require('mz/fs')
const path = require('path')
const assert = require('assert')
const Pluggable = require('./Pluggable')
const Commands = require('./Commands')
const globAsync = require('../utils/globAsync')

class Service extends Pluggable {
  constructor(config, repository) {
    super()
    this._repository = repository
    this._commands = new Commands()
    this._entry(config)
  }

  async _entry(config) {
    try {
      await this.apply('entry', this)
      await this._loadCommands()
      await this._loadPlugins()
      await this.apply('done', this)
    } catch (err) {
      console.log(err.stack)
    }

  }

  async _loadCommands() {
    const commandsDir = path.resolve(__dirname, './commands')
    const commandFiles = await globAsync(path.resolve(commandsDir, '!(*_test).js'))

    for (let commandFile of commandFiles) {
      const { name } = path.parse(commandFile)
      const module = require(commandFile)(this._repository)
      await this._commands.attachMethod(name, module)
    }

    await this.apply('after-commands', this)
  }

  async _loadPlugins() {
    const pluginsDir = path.resolve(__dirname, './plugins')
    const pluginFiles = await globAsync(path.resolve(pluginsDir, '!(*_test).js'))

    for (let pluginFile of pluginFiles) {
      const Plugin = require(pluginFile)(this._repository)
      // const plugin = new Plugin(this)
      // await plugin.apply(this)
    }

    await this.apply('after-plugins', this)
  }
}

var s = new Service({}, {})
