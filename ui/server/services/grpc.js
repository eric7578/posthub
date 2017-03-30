const grpc = require('grpc')
const path = require('path')

const rootProtoPath = path.resolve(__dirname, '../../../services/proto/root.proto')
module.exports = grpc.load(rootProtoPath)
