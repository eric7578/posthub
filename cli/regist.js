const assert = require('assert')

const { regist } = require('../usecases')

exports.describe = 'Regist a new user'

exports.options = {
  mail: {
    alias: 'm',
    required: true,
    describe: 'Mail'
  }
}

exports.handler = argv => {
  
}
