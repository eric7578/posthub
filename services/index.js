const path = require('path')
const grpc = require('grpc')

const composeRpcService = require('./composeRpcService')

const HOST = process.env.HOST || '0.0.0.0:3000'
const proto = grpc.load(path.resolve(__dirname, 'proto', 'root.proto'))

const server = new grpc.Server()
server.bind(HOST, grpc.ServerCredentials.createInsecure())

const MailIdentity = require('./rpcServices/MailIdentity')({
  user: require('../repository/user'),
  encrypt: require('../repository/encrypt'),
  token: require('../repository/token')
})
server.addProtoService(proto.user.MailIdentity.service, composeRpcService(MailIdentity))

server.start()
