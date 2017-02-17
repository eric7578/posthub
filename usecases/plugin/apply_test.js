const test = require('ava')
const proxyquire = require('proxyquire')
const { stub } = require('sinon')
const apply = require('./apply')

test('pass arguments throught all hooks, and call usecase at last', async t => {
  const array = []
  const val1 = 'value1'
  const val2 = 'value2'

  async function hook1(next, arg1, arg2) {
    t.is(typeof next.then, 'function')
    t.is(arg1, val1)
    t.is(arg2, val2)

    array.push(1)
    await next
    array.push(3)
  }

  async function hook2(next, arg1, arg2) {
    t.is(typeof next.then, 'function')
    t.is(arg1, val1)
    t.is(arg2, val2)

    array.push(2)
    await next
  }

  async function usecase(arg1, arg2) {
    t.is(arg1, val1)
    t.is(arg2, val2)

    array.push('usecase')
  }

  const fn = apply(usecase, [hook1, hook2])
  await fn(val1, val2)

  t.deepEqual(array, [1, 2, 'usecase', 3])
})
