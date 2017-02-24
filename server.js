const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const fs = require('mz/fs')
const path = require('path')

const glob = require('./utils/glob')

const { NODE_ENV, PORT } = process.env
const app = express()
app.set('port', PORT || 3000)
app.listen(app.get('port'), () => console.log(`listen on ${app.get('port')}`))

// load graphql files
const graphqlDir = path.resolve(process.cwd(), 'graphql')
glob(path.resolve(graphqlDir, '*.graphql'))
  .then(graphqlFiles =>
    graphqlFiles.map(graphqlFile =>
      fs
      .readFile(graphqlFile, { encoding: 'utf8' })
      .then(graphql => {
        const schema = buildSchema(graphql)
        const { name } = path.parse(graphqlFile)
        const rootValue = require(path.resolve(graphqlDir, name))
        app.use(`/${name}`, graphqlHttp({
          schema,
          rootValue,
          graphiql: true
        }))
        console.log(`apply graphql server on /${name}`)
      })
    )
  )
