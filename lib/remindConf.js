const { transaction } = require('objection');
const RemindConf = require("../models/RemindConf");

module.exports = async function remindConf(command, message) {
  if (command.length === 1) {
    try {
      const getRemindConf = await RemindConf.query().findOne({ ServerId: message.guild.id });
      if (getRemindConf != undefined) {
        message.channel.send('リマインドの設定\n```\nチャンネル: #' + getRemindConf.noticeChannelName + '\nメンション: ' + getRemindConf.noticeMention + '\n' + getRemindConf.advanceNotice + '分前に通知\n```')
          .then(msg => console.log(`Discord: Send (#${message.channel.name}) "${msg}`))
          .catch(console.error);
      } else {
        message.channel.send('リマインド設定\n```\n設定されていません\n```')
          .then(msg => console.log(`Discord: Send (#${message.channel.name}) "${msg}`))
          .catch(console.error);
      }
    } catch (err) {
      console.log(err);
    };
    return;
  }
  if (command.length === 4) {
    if (command[1].match(/<#[0-9]*>/) && command[2].match(/@.+/) && command[3].match(/[0-9].*/)) {
      const channelname = message.mentions.channels.last().name;
      const noticeMention = command[2];
      const advanseNotice = Number(command[3]);
      try {
        await transaction(RemindConf.knex(), async trx => {
          const getRemindConf = await RemindConf.query(trx).findOne({ serverId: message.guild.id });
          if (getRemindConf == undefined) {
            const createRemindConf = await RemindConf.query(trx).insert({
              serverId: message.guild.id,
              advanceNotice: advanseNotice,
              noticeChannelId: command[1],
              noticeChannelName: channelname,
              noticeMention: noticeMention,
            });
            console.log(`CREATE: RemindConf:${createRemindConf.id}`);
          } else {
            await RemindConf.query(trx).update({
              id: getRemindConf.id,
              serverId: message.guild.id,
              advanceNotice: advanseNotice,
              noticeChannelId: command[1],
              noticeChannelName: channelname,
              noticeMention: noticeMention,
            });
            console.log(`UPDATE: RemindConf:${getRemindConf.id}`);
          }
        });

        message.channel.send('リマインドの設定を変更しました。\n```\nチャンネル: #' + channelname + '\nメンション: ' + noticeMention + '\n' + advanseNotice + '分前に通知\n```')
          .then(msg => console.log(`Discord: Send (#${message.channel.name}) "${msg}`))
          .catch(console.error);
      } catch (err) {
        console.log(err);
      };

      return;
    }
  }
  commandError(message, '入力が間違っています');
}
