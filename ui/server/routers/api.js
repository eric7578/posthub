const Router = require('koa-router')
const users = require('./users')
const auth = require('./auth')

const router = new Router({
  prefix: '/api'
})

router.use(users.routes())
router.use(auth.routes())

module.exports = router
