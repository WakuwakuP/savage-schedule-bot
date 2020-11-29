
exports.up = function (knex) {
  return knex.schema
    .createTable('notificationJob', function (table) {
      table.increments('id').primary();
      table.string('scheduleId', 20);
      table.datetime('date');
      table.text('channelId');
      table.text('message');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('notificationJob');
};
