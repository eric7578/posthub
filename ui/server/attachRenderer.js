const { createBundleRenderer } = require('vue-server-renderer')

module.exports = (app, isProduction) => {
  let renderer
  if (isProduction) {
  } else {
    const setupDevServer = require('./setupDevServer')
    setupDevServer(app, (bundle, template) => {
      renderer = createBundleRenderer(bundle, {
        template,
        cache: require('lru-cache')({
          max: 1000,
          maxAge: 1000 * 60 * 15
        })
      })
    })
  }

  return async function attachRenderer(ctx, next) {
    if (renderer) {
      ctx.renderer = renderer
      await next()
    } else {
      ctx.body = 'waiting for initialized...'
    }
  }
}
