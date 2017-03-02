exports.up = async knex => {
  await knex.schema.createTable('users', t => {
    t.increments('id').primary()
    t.string('token')
    t.dateTime('createAt').notNullable()
    t.dateTime('lastLoginAt').notNullable()
  })
  await knex.schema.createTable('mailIdentities', t => {
    t.increments('id').primary()
    t.integer('userId').unsigned()
    t.foreign('userId').references('users.id')
    t.string('mail').notNullable().unique()
    t.string('password').notNullable()
  })
}

exports.down = async knex => {
  await knex.schema.dropTable('mailIdentities')
  await knex.schema.dropTable('users')
}
