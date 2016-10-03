
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t => {
    t.increments('id').primary();
    t.string('token');
    t.dateTime('createAt').notNullable();
    t.dateTime('lastLoginAt').notNullable();
  })
  .then(() =>
    knex.schema.createTable('mailIdentities', t => {
      t.increments('id').primary();
      t.integer('userId').unsigned();
      t.foreign('userId').references('users.id');
      t.string('mail').notNullable().unique();
      t.string('password').notNullable();
      t.string('salt').notNullable();
    })
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('mailIdentities')
  .then(() =>
    knex.schema.dropTable('users')
  );
};
