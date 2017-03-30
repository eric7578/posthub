const Router = require('koa-router')
const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy({
  usernameField: 'mail',
  passwordField: 'password'
}, async (mail, password, done) => {
  console.log(mail, password)
  if (mail === 'aaa' && password === 'bbb') {
    done(null, {
      mail,
      password,
      token: 't0kEn'
    })
  } else {
    done(null, false)
  }
}))

const router = new Router({
  prefix: '/auth'
})

router.post('/login', async (ctx, next) => {
  await new Promise((resolve, reject) => {
    ctx.login(ctx.request.body, err => {
      if (err) reject(err)
      else resolve()
    })
  })
})

module.exports = router
