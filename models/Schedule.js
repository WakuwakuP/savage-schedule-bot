const { Model } = require('./Model');

class Schedule extends Model {
  static tableName = 'schedule';
  static jsonSchema = {
    required: ['id', 'scheduleGroupId', 'channelId', 'date', 'time'],
    properties: {
      id: {
        type: "string",
        pattern: "^[0-9]+$"
      },
      scheduleGroupId: {
        type: 'integar',
        minimum: 0,
      },
      channelId: {
        type: "string",
        pattern: "^[0-9]+$"
      },
      date: {
        type: 'string',
        pattern: '^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$'
      },
      time: {
        type: 'string',
        pattern: '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      },
    },
  };

  static get relationMappings() {
    const Participant = require('./Participant');
    const ScheduleGroup = require('./ScheduleGroup');
    return {
      participants: {
        relation: Model.HasManyRelation,
        modelClass: Participant,
        join: {
          from: 'schedule.id',
          to: 'participant.scheduleId',
        }
      },
      scheduleGroup: {
        relation: Model.BelongsToOneRelation,
        modelClass: ScheduleGroup,
        join: {
          from: 'schedule.scheduleGroupId',
          to: 'scheduleGroup.id',
        },
      },
    };
  };
}

module.exports = Schedule;
