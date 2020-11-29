const NodeSchedule = require('node-schedule');
const NotificationJob = require('../models/NotificationJob');

const notificationJobList = new Map();
const remindJobList = new Map();

async function readyCreateJob(client) {
  const notificationJobs = await NotificationJob.query();
  notificationJobs.forEach(notificationJob => {
    const date = notificationJob.date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });
    const message = notificationJob.message;
    const scheduleId = notificationJob.scheduleId;
    const bindData = {
      client,
      channelId: notificationJob.channelId,
      message: notificationJob.message,
    };
    console.log(`JOB    :Create notification ${date} "${message}"`);
    const job = NodeSchedule.scheduleJob(scheduleId, date, async function (bindData) {
      (await bindData.client.channels.fetch(bindData.channelId))
        .send(bindData.message);
      notificationJobList.delete(this.name);
      console.log(`JOB    :Ran notification`);
      const { id } = await NotificationJob.query().findOne({ scheduleId: this.name });
      await NotificationJob.query().deleteById(id);
    }.bind(null, bindData));
    notificationJobList.set(scheduleId, job);
  });
}

async function createNotificationJob(scheduleId, date, channelId, message, client) {
  if (!notificationJobList.has(scheduleId)) {
    await NotificationJob.query().insert({ scheduleId, date, channelId, message });
    const bindData = { client, channelId, message };
    console.log(`JOB    :Create notification: ${date} "${message}"`);
    const job = NodeSchedule.scheduleJob(scheduleId, date, async function (bindData) {
      (await bindData.client.channels.fetch(bindData.channelId))
        .send(bindData.message);
      notificationJobList.delete(this.name);
      console.log(`JOB    :Run notification`);
      const { id } = await NotificationJob.query().findOne({ scheduleId: this.name });
      await NotificationJob.query().deleteById(id);
    }.bind(null, bindData));
    notificationJobList.set(scheduleId, job);
  }
}

async function deleteNotificationJob(scheduleId) {
  if (notificationJobList.has(scheduleId)) {
    const job = notificationJobList.get(scheduleId);
    job.cancel();
    job.off('run');
    notificationJobList.delete(scheduleId);
    console.log(`JOB    :Delete Job notification : ${scheduleId}`);
  }
};

module.exports = {
  readyCreateJob,
  createNotificationJob,
  deleteNotificationJob,
};
