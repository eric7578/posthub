const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const OAuthServer = require('express-oauth-server')

const app = express()

app.oauth = new OAuthServer({
  model: require('../repository/oauth')
})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.post('/oauth/token', app.oauth.authenticate())

app.use('/api', app.oauth.authorize(), function (req, res) {
  res.end('secret')
})
app.use('/public', function (req, res) {
  res.end('hello')
})

// 404 Not found
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)

  if (req.app.get('env') === 'production') {
    res.send(`<h1>${err.message}</h1>`)
  } else {
    res.send(`
      <h1>${err.message}</h1>
      <h2>${err.status}</h2>
      <pre>${err.stack}</pre>
    `)
  }
})

module.exports = app
