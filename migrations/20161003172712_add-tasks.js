
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('fleets', t => {
    t.increments('id').primary();
    t.integer('entityId').unsigned();
    t.foreign('entityId').references('entities.id');
    t.timestamp('estimated').notNullable();
    t.timestamp('elapsed').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('fleets');
};
