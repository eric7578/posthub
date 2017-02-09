const test = require('ava')
const { transformHookName } = require('./index')

test('keep no-dashed hook name the same', t => {
  const hookName = 'hookName'
  t.is(transformHookName(hookName), hookName)
})

test('transform dashed hook name into camel case', t => {
  const dashedHookName = 'dashed-hook-name'
  const camelCaseName = 'dashedHookName'
  t.is(transformHookName(dashedHookName), camelCaseName)
})
