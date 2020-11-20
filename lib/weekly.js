const { transaction } = require('objection');
const Schedule = require('../models/Schedule');
const ScheduleGroup = require("../models/ScheduleGroup");
const WeeklyConf = require("../models/WeeklyConf");
const { matchDate } = require('./regexConst');

const weekStr = ['日', '月', '火', '水', '木', '金', '土'];

module.exports = async function weekly(command, message) {
  if (command[1] == '--help') {
    //TODO: help
    return;
  }

  if (command.length == 2) {
    let week = [];
    try {
      const getWeeklyConfig = await WeeklyConf.query().findOne({ serverId: BigInt(message.guild.id) });
      week = [
        getWeeklyConfig.sunday.replace(/\:00$/, ''),
        getWeeklyConfig.monday.replace(/\:00$/, ''),
        getWeeklyConfig.tuesday.replace(/\:00$/, ''),
        getWeeklyConfig.wednesday.replace(/\:00$/, ''),
        getWeeklyConfig.thursday.replace(/\:00$/, ''),
        getWeeklyConfig.friday.replace(/\:00$/, ''),
        getWeeklyConfig.saturday.replace(/\:00$/, '')
      ];
    } catch (err) { console.log(err); };

    if (command[1].match(matchDate)) {
      const [m, d] = command[1].split('/').map(d => Number(d));
      const now = new Date();
      const startDate = new Date(now);
      startDate.setMonth(m - 1);
      startDate.setDate(d);
      if (startDate < now) {
        startDate.setFullYear(startDate.getFullYear() + 1);
      }
      const scheduleGroup = await ScheduleGroup.query().insert({
        serverId: message.guild.id,
      });
      for (let i = 0; i < 7; i++) {
        const dateStr = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
        const msg = await message.channel.send(`:yellow_circle:**${dateStr} (${weekStr[startDate.getDay()]}) - ${week[startDate.getDay()]}**\n> ⭕: \`0\`\n> ❌: \`0\`\n> ❓: \`0\``);
        await Schedule.query().insert({
          id: msg.id,
          scheduleGroupId: scheduleGroup.id,
          channelId: msg.channel.id,
          date: `${startDate.getFullYear()}/${dateStr}`,
          time: week[startDate.getDay()],
        });
        console.log(`Discord: Send (#${message.channel.name}) "${msg}`);
        await msg.react('⭕');
        await msg.react('❌');
        await msg.react('❓');
        startDate.setDate(startDate.getDate() + 1);
      }
    } else if (command[1].match(/^\+[1-9][0-9].*$/)) {
      const date = new Date();
      date.setDate(date.getDate + Number(command[1]));
      await transaction(ScheduleGroup, Schedule, async (ScheduleGroup, Schedule) => {
        const scheduleGroup = await ScheduleGroup.query().insert({
          serverId: message.guild.id,
        });
        for (let i = 0; i < 7; i++) {
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
          const msg = message.channel.send(`${dateStr} (${weekStr[date.getDay()]})- ${week[date.getDay()]}\n⭕: \`0\`\n❌: \`0\`\n❓: \`0\``);
          await Schedule.query().insert({
            id: msg.id,
            scheduleGroupId: scheduleGroup.id,
            channelId: msg.channel.id,
            date: `${date.getFullYear()}/${dateStr}`,
            time: week[date.getDay()],
          });
          console.log(`Discord: Send (#${message.channel.name}) "${msg}`);
          await msg.react('⭕');
          await msg.react('❌');
          await msg.react('❓');
          startDate.setDate(date.getDate() + 1);
        }
      });
    }
    return;
  }
}
