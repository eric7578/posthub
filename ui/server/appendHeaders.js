const koaPackageJSON = require('koa/package.json')

const serverName = `${koaPackageJSON.name}/${koaPackageJSON.version}`

module.exports = () => async (ctx, next) => {
  ctx.set('Server', serverName)
  await next()
}
