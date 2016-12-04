const thrift = require('thrift');
const fs = require('fs');
const path = require('path');

const processor = new thrift.MultiplexedProcessor();
const services = fs.readdirSync('./services');
services
  .map(service => path.resolve('./services', service))
  .filter(servicePath => fs.statSync(servicePath).isFile())
  .forEach(servicePath => {
    try {
      const { name } = path.parse(servicePath);
      const serviceName = name.charAt(0).toUpperCase() + name.slice(1);
      const service = require(servicePath);
      processor.registerProcessor(serviceName, new Echo.Processor(service));
    } catch (err) {
      console.log(`Fail require: ${servicePath}`)
      console.log(`ERR: ${err.message}`);
    }
  });

const server = thrift.createMultiplexServer(processor);
server.on('error', err => console.log(err));
server.listen(8080);
