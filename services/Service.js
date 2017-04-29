const Pluggable = require('./Pluggable')
const Command = require('./Command')

module.exports = class Service extends Pluggable {
  constructor (configs) {
    super()
    this._command = new Command()
    process.nextTick(() => this._entry(configs))
  }

  get command () {
    return this._command
  }

  async _entry (configs = {}) {
    try {
      await this.apply('entry', this)
      await this._mountCommands(configs)
      await this._mountPlugins(configs)
      await this.apply('done', this)
    } catch (err) {
      console.log(err.stack)
    }
  }

  async _mountCommands (configs) {
    if (configs.commands) {
      for (let name in configs.commands) {
        const command = configs.commands[name]
        const commandModule = command(this._repository)
        await this._command.attach(name, commandModule)
      }
    }

    await this.apply('after-commands', this)
  }

  async _mountPlugins (configs) {
    if (configs.plugins) {
      for (let pluginGen of configs.plugins) {
        const Plugin = pluginGen(this._repository)

        let plugin
        try {
          plugin = Plugin()
        } catch (err) {
          plugin = new Plugin()
        }

        plugin.apply(this)
      }
    }

    await this.apply('after-plugins', this)
  }
}
