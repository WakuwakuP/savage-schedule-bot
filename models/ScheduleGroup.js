const { Model } = require('./Model');

class ScheduleGroup extends Model {
  static tableName = 'scheduleGroup';

  static jsonSchema = {
    required: ['serverId'],
    properties: {
      serverId: {
        type: "string",
        pattern: "^[0-9]+$"
      },
    }
  }

  static get relationMappings() {
    const Schedule = require('./Schedule');
    const Server = require('./Server');
    return {
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
          from: 'scheduleGroup.id',
          to: 'schedule.shceduleGroupId',
        },
      },
    };
  }
}

module.exports = ScheduleGroup;
