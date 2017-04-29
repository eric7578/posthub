const test = require('ava')
const composeMiddlewares = require('./composeMiddlewares')

test('middlewares execution order', async t => {
  async function middleware1 (request, next) {
    request.push(0)
    await next()
    request.push(3)
  }

  async function middleware2 (request, next) {
    request.push(1)
  }

  async function middleware3 (request, next) {
    request.push(2)
  }

  const composed = composeMiddlewares([middleware1, middleware2, middleware3])
  const result = []
  await composed(result)

  t.deepEqual(result, [0, 1, 2, 3])
})

test('middleware execution context', async t => {
  const context = {}
  async function middleware (request, next) {
    t.is(this, context)
    await next()
  }

  const composed = composeMiddlewares([middleware], context)
  await composed({})
})
