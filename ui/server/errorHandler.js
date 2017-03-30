module.exports = () => async function errorHandler (ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = `
      <h2>${err.message || err}</h2>
      <pre>${err.stack || ''}</pre>
    `
  }
}
