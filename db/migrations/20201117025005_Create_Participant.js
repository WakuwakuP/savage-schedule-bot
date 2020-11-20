
exports.up = function (knex) {
  return knex.schema
    .createTable('participant', function (table) {
      table.increments('id').primary();
      table.string('userId', 20);
      table.string('scheduleId', 20);
      table.text('userName');
      table.integer('anser');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
      table.foreign('scheduleId').references('id').inTable('schedule').onDelete('cascade');
    })
    .raw('ALTER TABLE `participant` CHANGE `updated_at` `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
};

exports.down = function (knex) {
  return knex.schema
    .table('participant', function (table) {
      table.dropForeign('scheduleId');
    })
    .dropTable('participant');
};
