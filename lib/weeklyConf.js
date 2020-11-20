const { transaction } = require('objection');
const WeeklyConf = require("../models/WeeklyConf");
const { matchTime } = require('./regexConst');

module.exports = async function weeklyConf(command, message) {
  if (command[1] == '--help') {
    message.channel.send('TODO: hogehoge')
      .then(msg => console.log(`Discord: Send (#${message.channel.name}) "${msg}`))
      .catch(console.error);
    return;
  }
  if (command.length === 1) {
    const getWeeklyConf = await WeeklyConf.query().findOne({ serverId: message.guild.id });
    if (getWeeklyConf != undefined) {
      message.channel.send(
        '開始時間\n```\n日: ' + getWeeklyConf.sunday.replace(/\:00$/, '') + '\n月: ' + getWeeklyConf.monday.replace(/\:00$/, '') + '\n火: ' + getWeeklyConf.tuesday.replace(/\:00$/, '') + '\n水: ' + getWeeklyConf.wednesday.replace(/\:00$/, '') + '\n木: ' + getWeeklyConf.thursday.replace(/\:00$/, '') + '\n金: ' + getWeeklyConf.friday.replace(/\:00$/, '') + '\n土: ' + getWeeklyConf.saturday.replace(/\:00$/, '') + '\n```'
      ).then(msg => console.log(`Discord: Send (#${message.channel.name}) "${msg}`))
        .catch(console.error);
    } else {
      message.channel.send('開始時間\n```\n設定されていません。\n```')
        .then(msg => console.log(`Discord: Send (#${message.channel.name}) "${msg}`))
        .catch(console.error);
    }
    return;
  }
  if (command.length === 3) {
    if (command[1].match(matchTime) && command[2].match(matchTime)) {
      const holidays = String(command[1]);
      const weekdays = String(command[2]);
      try {
        await transaction(WeeklyConf.knex(), async trx => {
          const getWeeklyConf = await WeeklyConf.query(trx).findOne({ serverId: message.guild.id });
          if (getWeeklyConf == undefined) {
            const createWeeklyConf = await WeeklyConf.query(trx).insert({
              serverId: message.guild.id,
              sunday: holidays,
              monday: weekdays,
              tuesday: weekdays,
              wednesday: weekdays,
              thursday: weekdays,
              friday: weekdays,
              saturday: holidays,
            });
            console.log(`DB     : Create WeeklyConf ${createWeeklyConf.id}`);
          } else {
            await WeeklyConf.query(trx).update({
              id: getWeeklyConf.id,
              serverId: message.guild.id,
              sunday: holidays,
              monday: weekdays,
              tuesday: weekdays,
              wednesday: weekdays,
              thursday: weekdays,
              friday: weekdays,
              saturday: holidays,
            });
            console.log(`DB     : Update WeeklyConf:${getWeeklyConf.id}`);
          }
        });
        message.channel.send('開始時間を設定しました。\n```\n月～金: ' + weekdays + '\n土・日: ' + holidays + '\n```')
          .then(msg => console.log(`Discord: Send (#${message.channel.name}) "${msg}`))
          .catch(console.error);
      } catch (err) {
        console.log(err);
      }
      return;
    }
  }
  if (command.length === 8) {
    if (command[1].match(matchTime)
      && command[2].match(matchTime)
      && command[3].match(matchTime)
      && command[4].match(matchTime)
      && command[5].match(matchTime)
      && command[6].match(matchTime)
      && command[7].match(matchTime)) {
      const sunday = String(command[1]);
      const monday = String(command[2]);
      const tuesday = String(command[3]);
      const wednesday = String(command[4]);
      const thursday = String(command[5]);
      const friday = String(command[6]);
      const saturday = String(command[7]);
      try {
        await transaction(WeeklyConf.knex(), async trx => {
          const getWeeklyConf = await WeeklyConf.query(trx).findOne({ serverId: message.guild.id });
          if (getWeeklyConf == undefined) {
            const createWeeklyConf = await WeeklyConf.query(trx).insert({
              serverId: message.guild.id,
              sunday,
              monday,
              tuesday,
              wednesday,
              thursday,
              friday,
              saturday,
            });
            console.log(`DB     : Create WeeklyConf:${createWeeklyConf.id}`);
          } else {
            await WeeklyConf.query(trx).update({
              id: getWeeklyConf.id,
              serverId: message.guild.id,
              sunday,
              monday,
              tuesday,
              wednesday,
              thursday,
              friday,
              saturday,
            });
            console.log(`DB     : Update WeeklyConf:${getWeeklyConf.id}`);
          }
        });
        message.channel.send(
          '開始時間を設定しました。\n```\n日: ' + sunday + '\n月: ' + monday + '\n火: ' + tuesday + '\n水: ' + wednesday + '\n木: ' + thursday + '\n金: ' + friday + '\n土: ' + saturday + '\n```'
        ).then(msg => console.log(`Discord: Send (#${message.channel.name}) ${msg.toString().replace('\n', '\\n')}`))
          .catch(console.error);
      } catch (err) {
        console.log(err);
      }
      return;
    }
  } else {
    commandError(message, '入力が間違っています');
  }
}
