
exports.up = function (knex) {
  return knex.schema
    .createTable('scheduleGroup', function (table) {
      table.increments('id').primary().unsigned();
      table.string('serverId', 20);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.foreign('serverId').references('id').inTable('server').onDelete('cascade');
    });
};

exports.down = function (knex) {
  return knex.schema
    .table('scheduleGroup', function (table) {
      table.dropForeign('serverId');
    })
    .dropTable('scheduleGroup');
};
