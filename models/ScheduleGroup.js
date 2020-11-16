const { Model } = require('./Model');
const Schedule = require('./Schedule');
const Server = require('./Server');

class ScheduleGroup extends Model {
  static tableName = 'scheduleGroup';

  static jsonSchema = {
    required: ['serverId'],
    properties: {
      serverId: {
        type: 'number',
        minimum: 0,
      },
    }
  }

  static relrationMappings = {
    server: {
      relation: Model.BelongsToOneRelation,
      modelClass: Server,
      join: {
        from: 'scheduleGroup.serverId',
        to: 'server.id',
      },
    },
    schedules: {
      relation: Model.HasManyRelation,
      modelClass: Schedule,
      join: {
        from: 'shceduleGroup.id',
        to: 'schedule.shceduleGroupId',
      },
    },
  };
}

module.exports = ScheduleGroup;
