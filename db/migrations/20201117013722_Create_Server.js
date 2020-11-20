
exports.up = function (knex) {
  return knex.schema
    .createTable('server', function (table) {
      table.string('id', 20).primary();
      table.text('name');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('server');
};
