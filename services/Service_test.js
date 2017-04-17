const test = require('ava')
const { spy } = require('sinon')
const Service = require('./Service')

test.cb('service initialize orders', t => {
  const service = new Service()
  const entry = spy()
  const afterCommands = spy()
  const afterPlugins = spy()
  const done = spy()

  service.plugin('entry', entry)
  service.plugin('after-commands', afterCommands)
  service.plugin('after-plugins', afterPlugins)
  service.plugin('done', done)

  service.plugin('done', () => {
    t.true(entry.calledBefore(afterCommands))
    t.true(afterCommands.calledBefore(afterPlugins))
    t.true(afterPlugins.calledBefore(done))

    t.true(entry.calledWithExactly(service))
    t.true(afterCommands.calledWithExactly(service))
    t.true(afterPlugins.calledWithExactly(service))
    t.true(done.calledWithExactly(service))

    t.end()
  })
})

test.cb('mounting plugins to service', t => {
  const service = new Service({
    commands: {
      method: repository => () => {},
      module: repository => ({
        moduleMethod: () => {}
      })
    }
  })

  service.plugin('done', service => {
    t.is(typeof service.command.method, 'function')
    t.is(typeof service.command.module.moduleMethod, 'function')
    t.end()
  })
})
