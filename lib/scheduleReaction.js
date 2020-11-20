const { transaction } = require('objection');
const Participant = require("../models/Participant");
const Schedule = require('../models/Schedule');

const ansers = ['⭕', '❌', '❓'];

async function scheduleReactionAdd(userId, scheduleId, userName, anserStr) {
  const anser = conversionAnserStrToId(anserStr);
  const schedule = await Schedule.query().findOne({ id: scheduleId }).catch(() => undefined);
  if (schedule == undefined) {
    return;
  }
  await transaction(Participant.knex(), async trx => {
    const participant = await Participant.query(trx).where('userId', userId).where('scheduleId', scheduleId).first();

    if (participant == undefined) {
      const insertResponse = await Participant.query(trx).insert({ userId, scheduleId, userName, anser });
      console.log(`DB     : Insert Participant ${insertResponse.id} ${insertResponse.userName} ${conversionAnserIdToStr(insertResponse.anser)}`);
    } else {
      const id = participant.id;
      const updateResponse = await Participant.query(trx).updateAndFetchById(id, { userId, scheduleId, userName, anser });
      console.log(`DB     : Update Participant ${updateResponse.id} ${updateResponse.userName} ${conversionAnserIdToStr(updateResponse.anser)}`);
    }
  }).catch(err => {
    console.log('DB     : Transaction Error.');
  });
}

async function scheduleReactionmessageEdit(message) {
  const schedule = await Schedule.query().findById(message.id).catch(() => undefined);
  const participants = await Schedule.relatedQuery('participants').for(schedule).catch(() => []);
  const ansers = [[], [], []];
  participants.forEach(participant => {
    ansers[participant.anser].push(`<@!${participant.userId}>`);
  });
  const scheduleStr = getScheduleStr(schedule);
  const oStr = getAnserStr(ansers[0]);
  const xStr = getAnserStr(ansers[1]);
  const qStr = getAnserStr(ansers[2]);
  let status = ':yellow_circle:';
  if (ansers[1].length > 0) {
    status = ':red_circle:';
  } else if (ansers[0].length >= 8) {
    status = ':green_circle:';
  }

  const msg = await message.edit(`${status}**${scheduleStr}**\n> ⭕: ${oStr}\n> ❌: ${xStr}\n> ❓: ${qStr}`).catch(() => 'error');
  console.log(`Discord: Send (#${message.channel.name}) "${msg}`);
}

function conversionAnserStrToId(anserStr) {
  return ansers.findIndex(data => data == anserStr);
}

function getScheduleStr(schedule) {
  const weekStr = ['日', '月', '火', '水', '木', '金', '土'];
  return `${schedule.date.getMonth() + 1}/${schedule.date.getDate()} (${weekStr[schedule.date.getDay()]}) - ${schedule.time.replace(/\:00$/, '')}`;
}

function conversionAnserIdToStr(anser) {
  return ansers[anser];
}

function getAnserStr(anserlist) {
  return `\`${anserlist.length}\` ${anserlist.length == 0 ? '' : `(${anserlist.join(', ')})`}`
}

module.exports = {
  scheduleReactionAdd,
  scheduleReactionmessageEdit,
  ansers,
};
