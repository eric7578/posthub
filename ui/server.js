const Koa = require('koa')
// const favicon = require('koa-favicon')
const serve = require('koa-static')
const compress = require('koa-compress')
const mount = require('koa-mount')
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')
const session = require('koa-generic-session')
const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const http = require('http')
const socketIO = require('socket.io')
const attachRenderer = require('./server/attachRenderer')
const errorHandler = require('./server/errorHandler')
const appendHeaders = require('./server/appendHeaders')

const apiRouter = require('./server/routers/api')

const app = new Koa()

app.keys = ['secret']

app.use(bodyParser())
app.use(appendHeaders())
app.use(mount('/dist', serve(__dirname + '/dist')))
app.use(mount('/images', serve(__dirname + '/public/images')))
app.use(errorHandler())

app.use(convert(session()))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user.token)
})

passport.deserializeUser(async (user, done) => {
  try {
    done(null, user)
  } catch(err) {
    done(err)
  }
})

app.use(compress({ threshold: 0 }))
app.use(serve(__dirname))
app.use(attachRenderer(app, process.env.NODE_ENV === 'production'))

app.use(apiRouter.routes())

app.use(async (ctx, next) => {
  await next()

  ctx.set('Content-Type', 'text/html')
  ctx.status = 200
  await new Promise((resolve, reject) => {
    ctx.renderer
      .renderToStream({
        url: ctx.url,
        user: {
          'toknizer': 'adsadasdasdasdadasd'
        }
      })
      .on('error', reject)
      .on('end', resolve)
      .pipe(ctx.res)
  })
})

const server = http.createServer(app.callback())
const socketServer = socketIO(server)
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`> Listening on :${PORT}`)
})
