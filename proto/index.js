const assert = require('assert')
const path = require('path')
const fs = require('fs')
const grpc = require('grpc')
const logger = require('log4js').getLogger('proto')

const cwd = process.cwd()
const protorcPath = path.resolve(cwd, 'proto.config.js')
const protorc = require(protorcPath)

protorc.servers.forEach(configServer)

function configServer(serverOptions) {
  const server = new grpc.Server()


  serverOptions.services
    .map(loadProtoModule)
    .forEach(configService(server))
  server.bind(serverOptions.host, grpc.ServerCredentials.createInsecure())
  server.start()
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

function configService(server) {
  return ({ proto, module }) => {
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
  }
}
