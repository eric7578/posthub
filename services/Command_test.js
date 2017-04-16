const test = require('ava')
const { spy } = require('sinon')
const Command = require('./Command')

test('attach method to command', async t => {
  const command = new Command()
  const method = spy()
  const beforeExecute = spy()
  const afterExecute = spy()
  const payload = {
    data: 'some payload data'
  }

  command.attach('method', method)
  command.plugin('method', method => {
    method.plugin('before-execute', beforeExecute)
    method.plugin('after-execute', afterExecute)
  })
  await command.method(payload)

  t.true(beforeExecute.calledOnce)
  t.true(method.calledOnce)
  t.true(afterExecute.calledOnce)
  t.true(beforeExecute.calledWithExactly(payload))
  t.true(method.calledWithExactly(payload))
  t.true(afterExecute.calledWithExactly(payload))
  t.true(beforeExecute.calledBefore(method))
  t.true(method.calledBefore(afterExecute))
})

test('attach module to command', async t => {
  const command = new Command()
  const module = {
    method: spy()
  }
  const beforeExecute = spy()
  const afterExecute = spy()
  const payload = {
    data: 'some payload data'
  }

  command.attach('module', module)
  command.plugin('module.method', method => {
    method.plugin('before-execute', beforeExecute)
    method.plugin('after-execute', afterExecute)
  })
  await command.module.method(payload)

  t.true(beforeExecute.calledOnce)
  t.true(module.method.calledOnce)
  t.true(afterExecute.calledOnce)
  t.true(beforeExecute.calledWithExactly(payload))
  t.true(module.method.calledWithExactly(payload))
  t.true(afterExecute.calledWithExactly(payload))
  t.true(beforeExecute.calledBefore(module.method))
  t.true(module.method.calledBefore(afterExecute))
})
