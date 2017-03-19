const assert = require('assert')

const MIDDLEWARES_SHOULD_BE_ARR = 'middlewares should be array'
const MIDDLEWARE_SHOULD_BE_FUNC = 'middleware should be function'
const { slice } = Array.prototype

module.exports = (middlewares, context = null) => {
  assert(Array.isArray(middlewares), MIDDLEWARES_SHOULD_BE_ARR)
  assert(middlewares.every(fn => typeof fn === 'function'), MIDDLEWARE_SHOULD_BE_FUNC)

  return async function () {
    const args = slice.call(arguments)

    // run middlewares
    const promise = middlewares.reduce((next, middleware) => {
      const middlewareArgs = args.concat(next)
      return middleware.apply(context, middlewareArgs)
    }, Promise.resolve())

    return await promise
  }
}
