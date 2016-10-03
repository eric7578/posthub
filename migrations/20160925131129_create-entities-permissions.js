
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('entities', t => {
    t.increments('id').primary();
    t.integer('parentId').unsigned();
    t.foreign('parentId').references('entities.id');
    t.string('title').notNullable();
    t.integer('level').notNullable();
    t.timestamp('createAt').notNullable();
    t.timestamp('updateAt').notNullable();
  })
  .then(() =>
    knex.schema.createTableIfNotExists('permissions', t => {
      t.increments('id').primary();
      t.integer('userId').unsigned();
      t.foreign('userId').references('users.id');
      t.integer('entityId').unsigned();
      t.foreign('entityId').references('entities.id');
      t.integer('auth').unsigned().notNullable();
    })
  )
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permissions')
  .then(() => knex.schema.dropTable('entities'));
};
