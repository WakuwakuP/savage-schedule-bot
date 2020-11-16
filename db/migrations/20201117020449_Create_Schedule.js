
exports.up = function (knex) {
  return knex.schema
    .createTable('schedule', function (table) {
      table.increments('id').primary().unsigned();
      table.integer('scheduleGroupId').unsigned();
      table.date('date');
      table.time('time');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
      table.foreign('scheduleGroupId').references('id').inTable('scheduleGroup').onDelete('cascade');
    })
    .raw('ALTER TABLE `schedule` CHANGE `updated_at` `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
};

exports.down = function (knex) {
  return knex.schema
    .table('schedule', function (table) {
      table.dropForeign('scheduleGroupId');
    })
    .dropTable('schedule');
};
