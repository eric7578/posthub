const Pluggable = require('./Pluggable')

class Execute extends Pluggable {
  constrctor(name, args) {
    this._name = name
    this._arguments = Array.isArray(args) ? args : [args]
  }

  get name() {
    return this._name
  }

  get arguments() {
    return this._args
  }
}

module.exports = class Commands extends Pluggable {
  async attachMethod(methodName, module) {
    // turn commands into instance methods
    Object.defineProperty(this, methodName, {
      enumerable: true,
      writable: false,
      value: async () => {
        const args = Array.prototype.slice.call(arguments)
        const execute = new Execute(methodName, args)

        await this.apply(methodName, execute)
        await this.apply('before-execute', execute)

        await execute.apply('before-execute', args)
        await module.apply(null, args)
        await execute.apply('after-execute', args)

        await this.apply('after-execute', execute)
      }
    })
  }
}
