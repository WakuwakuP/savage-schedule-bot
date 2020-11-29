
exports.up = function (knex) {
  return knex.schema
    .alterTable('remindConf', function (table) {
      table.integer('deadline').notNullable().after('advanceNotice');
    })
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('remindConf', function (table) {
      table.dropColumn('deadline');
    });
};
