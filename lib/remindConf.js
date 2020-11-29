const { MessageEmbed } = require('discord.js');
const { transaction } = require('objection');
const RemindConf = require("../models/RemindConf");
const { matchTime } = require('./regexConst');

module.exports = async function remindConf(command, message) {
  if (command.length === 1) {
    try {
      const getRemindConf = await RemindConf.query().findOne({ ServerId: message.guild.id });
      if (getRemindConf != undefined) {
        const embed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('リマインドの設定')
          .setDescription(`チャンネル:  <#${getRemindConf.noticeChannelId}>\nメンション: ${getRemindConf.noticeMention}\n通知: ${getRemindConf.advanceNotice}分前\n締切: ${getRemindConf.deadline}時間前`);
        message.channel.send(embed)
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
  if (command.length === 5) {
    if (command[1].match(/<#[0-9]*>/) && command[2].match(/@.+/) && command[3].match(/[0-9].*/) && command[4].match(/[0-9].*/)) {
      const channel = message.mentions.channels.last();
      const channelName = channel.name;
      const channelId = channel.id;
      const noticeMention = command[2];
      const advanseNotice = Number(command[3]);
      const deadline = command[4];
      try {
        await transaction(RemindConf.knex(), async trx => {
          const getRemindConf = await RemindConf.query(trx).findOne({ serverId: message.guild.id });
          if (getRemindConf == undefined) {
            const createRemindConf = await RemindConf.query(trx).insert({
              serverId: message.guild.id,
              advanceNotice: advanseNotice,
              deadline: deadline,
              noticeChannelId: channelId,
              noticeChannelName: channelName,
              noticeMention: noticeMention,
            });
            console.log(`CREATE: RemindConf:${createRemindConf.id}`);
          } else {
            await RemindConf.query(trx).update({
              id: getRemindConf.id,
              serverId: message.guild.id,
              advanceNotice: advanseNotice,
              deadline: deadline,
              noticeChannelId: channelId,
              noticeChannelName: channelName,
              noticeMention: noticeMention,
            });
            console.log(`UPDATE: RemindConf:${getRemindConf.id}`);
          }
        });

        const embed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('リマインドの設定を変更しました。')
          .setDescription(`チャンネル:  ${command[1]}\nメンション: <#${noticeMention}>\n通知: ${advanseNotice}分前\n締切: ${deadline}時間前`);

        message.channel.send(embed)
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
