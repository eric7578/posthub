const assert = require('assert')
const path = require('path')
const fs = require('fs')
const grpc = require('grpc')
const logger = require('log4js').getLogger('proto')

const proto = grpc.load(path.resolve(process.cwd(), 'proto', 'root.proto'))
const server = new grpc.Server()

function configServer([service, serverOptions]) {
  const { proto, module } = loadProtoModule(service)
  configService(proto, module, serverOptions)
}

function loadProtoModule(service) {
  const dir = path.resolve(process.cwd(), 'proto')
  const protoFilePath = path.format({
    dir,
    name: service,
    ext: path.extname(service) || '.proto'
  })
  const modulePath = path.format({
    dir,
    name: service,
    ext: '.js'
  })

  return {
    proto: grpc.load(protoFilePath),
    module: require(modulePath)
  }
}

function configService(proto, module, opt) {

  Object
    .values(proto)
    .filter(instance => instance.service)
    .forEach(instance => {
      const { service } = instance
      const serviceGenerator = module[service.name]
      assert.equal(
        typeof serviceGenerator,
        'function',
        `${service.name} should be a exported method`
      )

      server.addProtoService(service, serviceGenerator(proto))
      logger.info(`Init service: ${service.name}`)
    })
  server.bind(opt.host, grpc.ServerCredentials.createInsecure());
}
