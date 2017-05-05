const assert = require('assert')
const path = require('path')
const Pluggable = require('./Pluggable')

class Execute extends Pluggable {
  constrctor (name, args) {
    this._name = name
    this._arguments = Array.isArray(args) ? args : [args]
  }

  get name () {
    return this._name
  }

  get arguments () {
    return this._args
  }
}

module.exports = class Command extends Pluggable {
  constructor (configs) {
    super()
    this._commands = configs.commands
  }

  attach () {
    for (let name in this._commands) {
      const module = this._commands[name]
      if (typeof module === 'function') {
        this._attachMethod(name, module)
      } else if (typeof module === 'object') {
        this._attachModule(name, module)
      }
    }
  }

  _attachMethod (methodName, method) {
    // turn commands into instance methods
    Object.defineProperty(this, methodName, {
      enumerable: true,
      writable: false,
      value: this._wrapMethod(methodName, method)
    })
  }

  _attachModule (moduleName, module) {
    this[moduleName] = Object
      .entries(module)
      .reduce((wrapper, [methodName, method]) => {
        wrapper[methodName] = this._wrapMethod(`${moduleName}.${methodName}`, method)
        return wrapper
      }, {})
  }

  _wrapMethod (methodName, method) {
    return async (...args) => {
      const execute = new Execute(methodName, args)

      await this.apply(methodName, execute)
      await this.apply('before-execute', execute)

      await execute.apply.apply(execute, ['before-execute'].concat(args))
      await method.apply(null, args)
      await execute.apply.apply(execute, ['after-execute'].concat(args))

      await this.apply('after-execute', execute)
    }
  }
}
