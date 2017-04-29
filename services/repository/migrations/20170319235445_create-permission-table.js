exports.up = async knex => {
  await knex.schema.createTable('permissions', t => {
    t.integer('userId').unsigned()
    t.foreign('userId').references('users.id')
    t.integer('entityId').unsigned()
    t.foreign('entityId').references('entities.id')
    t.integer('value').unsigned()
  })

  await knex.schema.createTable('tokens', t => {
    t.integer('userId').unsigned()
    t.foreign('userId').references('users.id')
    t.string('token')
  })
}

exports.down = async knex => {
  await knex.schema.dropTable('permissions')
  await knex.schema.dropTable('tokens')
}
