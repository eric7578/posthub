const assert = require('assert')

const { slice } = Array.prototype

module.exports = function (usecase, hooks) {
  if (!Array.isArray(hooks)) {
    hooks = slice.call(arguments, 1)
  }

  return async function compose() {
    let next = Promise.resolve()
    const args = slice.call(arguments)

    // run hooks
    let i = 0
    while (i < hooks.length) {
      const hookArgs = [next].concat(args)
      next = hooks[i++].apply(null, hookArgs)
    }

    // run usecase
    next = usecase.apply(null, args)
    await next
  }
}
