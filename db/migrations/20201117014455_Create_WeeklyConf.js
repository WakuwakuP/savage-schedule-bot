
exports.up = function (knex) {
  return knex.schema
    .createTable('weeklyConf', function (table) {
      table.increments('id').primary().unsigned();
      table.bigInteger('serverId').unsigned().unique();
      table.time('sunday');
      table.time('monday');
      table.time('tuesday');
      table.time('wednesday');
      table.time('thursday');
      table.time('friday');
      table.time('saturday');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
      table.foreign('serverId').references('id').inTable('server').onDelete('cascade');

    })
    .raw('ALTER TABLE `weeklyConf` CHANGE `updated_at` `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
};

exports.down = function (knex) {
  return knex.schema
    .table('weeklyConf', function (table) {
      table.dropForeign('serverId');
    })
    .dropTable('weeklyConf');
};
