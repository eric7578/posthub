const path = require('path')

module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      tableName: 'knex_migrations'
    }
  },
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'user',
      password: 'password',
      database: 'default'
    }
  }
}
