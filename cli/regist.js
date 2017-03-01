const prompt = require('prompt')
const assert = require('assert')

exports.command = 'regist'

exports.describe = 'make a get HTTP request'

exports.builder = {
  mail: {
    alias: 'm',
    required: true,
    describe: 'User regist mail'
  }
}

exports.handler = argv => {
  prompt.start()
  prompt.get({
    properties: {
      password: {
        hidden: true
      }
    }
  }, (err, result) => {
    console.log(argv.mail)
    console.log(result.password)
  })
}
