
exports.up = function (knex) {
  return knex.schema
    .createTable('remindConf', function (table) {
      table.increments('id').primary().unsigned();
      table.string('serverId', 20).unique();
      table.integer('advanceNotice').unsigned();
      table.text('noticeChannelId');
      table.text('noticeChannelName');
      table.text('noticeMention');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
      table.foreign('serverId').references('id').inTable('server').onDelete('cascade');
    })
    .raw('ALTER TABLE `remindConf` CHANGE `updated_at` `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
};

exports.down = function (knex) {
  return knex.schema
    .table('remindConf', function (table) {
      table.dropForeign('serverId');
    })
    .dropTable('remindConf');
};
