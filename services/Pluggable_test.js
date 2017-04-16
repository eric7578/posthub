const test = require('ava')
const { spy } = require('sinon')
const Pluggable = require('./Pluggable')

test('plugin callback should be apply when hook to Pluggable', async t => {
  const pluggable = new Pluggable()
  const callback = spy()
  const payload = {
    data: 'some payload data'
  }

  pluggable.plugin('plugin-event', callback)
  await pluggable.apply('plugin-event', payload)

  t.true(callback.calledOnce)
  t.true(callback.calledWithExactly(payload))
})
