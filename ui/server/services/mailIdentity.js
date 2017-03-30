const grpc = require('grpc')
const { user } = require('./grpc')
const promisify = require('./promisifyRpcService')

const service = new user.MailIdentity('0.0.0.0:3000', grpc.credentials.createInsecure())

module.exports = promisify(service)
