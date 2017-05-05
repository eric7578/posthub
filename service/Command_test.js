const test = require('ava')
const { spy, stub } = require('sinon')
const Command = require('./Command')

test('attach method/module to command', async t => {
  const repository = {}
  const method = function () {}
  const module = {
    method: function () {}
  }
  const command = new Command({
    repository,
    commands: {
      method,
      module
    }
  })

  command.attach()
  
  t.is(typeof command.method, 'function')
  t.is(typeof command.module.method, 'function')
})

test('attach method hooks to command execution', async t => {
  const method = spy()
  const beforeExecute = spy()
  const afterExecute = spy()
  const payload = {
    data: 'some payload data'
  }
  const command = new Command({
    commands: {
      method
    }
  })
  command.plugin('method', method => {
    method.plugin('before-execute', beforeExecute)
    method.plugin('after-execute', afterExecute)
  })

  command.attach()
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

test('attach module hooks to command execution', async t => {
  const module = {
    method: spy()
  }
  const beforeExecute = spy()
  const afterExecute = spy()
  const payload = {
    data: 'some payload data'
  }
  const command = new Command({
    commands: {
      module
    }
  })
  command.plugin('module.method', method => {
    method.plugin('before-execute', beforeExecute)
    method.plugin('after-execute', afterExecute)
  })

  command.attach()
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

test('before-execute, after-execute should be hook to all commands', async t => {
  const method = function () {}
  const module = {
    method: function () {}
  }
  const beforeExecute = spy()
  const afterExecute = spy()
  const command = new Command({
    commands: {
      method,
      module
    }
  })
  command.plugin('before-execute', beforeExecute)
  command.plugin('after-execute', afterExecute)

  command.attach()
 
  await command.method()
  await command.module.method()

  t.true(beforeExecute.calledTwice)
  t.true(afterExecute.calledTwice)
})
