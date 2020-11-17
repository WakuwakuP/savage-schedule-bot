const { Model } = require('./Model');
const Participant = require('./Participant');
const ScheduleGroup = require('./ScheduleGroup');

class Schedule extends Model {
  static tableName = 'schedule';

  static jsonSchema = {
    required: ['id', 'scheduleGroupId', 'date', 'time'],
    properties: {
      id: {
        type: 'Number',
        minimum: 0,
      },
      scheduleGroupId: {
        type: 'integar',
        minimum: 0,
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
