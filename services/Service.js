const Pluggable = require('./Pluggable')
const Command = require('./Command')

module.exports = class Service extends Pluggable {
  constructor (configs = {}) {
    super()
    this._configs = configs
  }

  get command () {
    return this._command
  }

  async run () {
    try {
      await this.apply('entry', this)
      await this._mountCommands()
      await this._mountPlugins()
      await this.apply('done', this)
    } catch (err) {
      console.log(err.stack)
    }
  }

  async _mountCommands () {
    this._command = new Command(this._configs)
    this._command.attach()
    await this.apply('after-commands', this)
  }

  async _mountPlugins () {
    if (this._configs.plugins) {
      for (let plugin of this._configs.plugins) {
        plugin.apply(this)
      }
    }

    await this.apply('after-plugins', this)
  }
}
