const Router = require('koa-router')
const mailIdentity = require('../services/mailIdentity')

const router = new Router({
  prefix: '/users'
})

router.post('/', async (ctx, next) => {
  ctx.body = await mailIdentity.regist({
    mail: ctx.body.mail,
    password: ctx.body.password
  })
})

router.post('/token', async (ctx, next) => {
  const { token } = await mailIdentity.login({
    mail: ctx.body.mail,
    password: ctx.body.password
  })
  ctx.body = JSON.stringify(token)
})

module.exports = router
