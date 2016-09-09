/**
 * set response-time for responseTime calculation
 * @param  {[type]}   ctx  [koa context]
 * @param  {Function} next [description]
 * @return {Promise}       [description]
 */
export default async function responseTime(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('response-time', ms);
}
