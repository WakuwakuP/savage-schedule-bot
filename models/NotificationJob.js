const { Model } = require('./Model');

class NotificationJob extends Model {
  static tableName = 'notificationJob';

  static jsonSchema = {
    required: ['scheduleId', 'channelId', 'date', 'message'],
    properties: {
      scheduleId: {
        type: "string",
        pattern: "^[0-9]+$"
      },
      channelId: {
        type: "text",
      },
      date: {
        type: "date",
      },
      message: {
        type: "text",
      },
    },
  };
}

module.exports = NotificationJob;
