const { Model } = require('./Model');
const Participant = require('./Participant');
const ScheduleGroup = require('./ScheduleGroup');

class Schedule extends Model {
  static tableName = 'schedule';

  static jsonSchema = {
    required: ['scheduleGroupId', 'date', 'time'],
    properties: {
      scheduleGroupId: {
        type: 'integar',
        minimum: 0,
      },
      date: { pattern: /(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])/ },
      time: { pattern: /([01][0-9]|2[0-3]):[0-5][0-9]/ },
    },
  };

  static relrationMappings = {
    participants: {
      relation: Model.HasManyRelation,
      modelClass: Participant,
      join: {
        from: 'schedule.id',
        to: 'participant.scheduleId',
      }
    },
    server: {
      relation: Model.BelongsToOneRelation,
      modelClass: ScheduleGroup,
      join: {
        from: 'schedule.scheduleGroupId',
        to: 'schedule.id',
      },
    },
  };
}

module.exports = Schedule;
