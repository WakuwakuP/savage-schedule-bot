const RemindConf = require("../models/RemindConf");

module.exports = async function remindConf(command, message) {
  if (command.length === 1) {
    try {
      const getRemindConf = await RemindConf.query().findOne({ ServerId: Number(message.guild.id) });
      if (getRemindConf != undefined) {
        message.channel.send('リマインドの設定\n```\nチャンネル: #' + getRemindConf.noticeChannelName + '\nメンション: ' + getRemindConf.noticeMention + '\n' + getRemindConf.advanceNotice + '分前に通知\n```')
          .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
          .catch(console.error);
      } else {
        message.channel.send('リマインド設定\n```\n設定されていません\n```')
          .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
          .catch(console.error);
      }
    } catch (err) {
      console.log(err);
    };
    return;
  }
  if (command.length === 4) {
    if (command[1].match(/<#[0-9]*>/) && command[2].match(/@.+/) && command[3].match(/[0-9].*/)) {
      remaind = {
        channel: command[1],
        mention: command[2],
        advance: Number(command[3])
      };
      const channelname = message.mentions.channels.last().name;
      try {
        await transaction(RemindConf.knex(), async trx => {
          const getRemindConf = await RemindConf.query(trx).findOne({ serverId: Number(message.guild.id) });
          if (getRemindConf == undefined) {
            const createRemindConf = await RemindConf.query(trx).insert({
              serverId: Number(message.guild.id),
              advanceNotice: Number(command[3]),
              noticeChannelId: command[1],
              noticeChannelName: channelname,
              noticeMention: command[2],
            });
            console.log(`CREATE: RemindConf:${createRemindConf.id}`);
          } else {
            await RemindConf.query(trx).update({
              id: getRemindConf.id,
              serverId: Number(message.guild.id),
              advanceNotice: Number(command[3]),
              noticeChannelId: command[1],
              noticeChannelName: channelname,
              noticeMention: command[2],
            });
            console.log(`UPDATE: RemindConf:${getRemindConf.id}`);
          }
        });

        message.channel.send('リマインドの設定を変更しました。\n```\nチャンネル: #' + channelname + '\nメンション: ' + remaind.mention + '\n' + remaind.advance + '分前に通知\n```')
          .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
          .catch(console.error);
      } catch (err) {
        console.log(err);
      };

      return;
    }
  }
  commandError(message, '入力が間違っています');
}
