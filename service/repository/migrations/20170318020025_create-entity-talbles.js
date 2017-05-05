exports.up = async knex => {
  await knex.schema.createTable('entities', t => {
    t.increments('id').primary()
    t.integer('parentId').unsigned()
    t.foreign('parentId').references('entities.id')
    t.integer('level').unsigned().notNullable()
    t.string('title').notNullable()
  })
}

exports.down = async knex => {
  await knex.schema.dropTable('entities')
}
