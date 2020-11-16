
exports.up = function (knex) {
  return knex.schema
    .createTable('server', function (table) {
      table.bigInteger('id').primary().unsigned();
      table.text('name');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('server');
};
