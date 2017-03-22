const path = require('path')

module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      tableName: 'knex_migrations'
    }
  }
}
