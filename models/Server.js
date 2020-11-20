const { Model } = require('./Model');

class Server extends Model {
  static tableName = 'server';

  static jsonSchema = {
    required: ['id'],
    properties: {
      id: {
        type: "string",
        pattern: "^[0-9]+$"
      },
      name: {
        type: 'text',
      }
    }
  }

  static get relationMappings() {
    const ScheduleGroup = require('./ScheduleGroup.js');
    const WeeklyConf = require('./WeeklyConf.js');
    return {
      weeklyConf: {
        relation: Model.HasOneRelation,
        modelClass: WeeklyConf,
        join: {
          from: 'server.id',
          to: 'weeklyConf.serverId',
        },
      },
      scheduleGroups: {
        relation: Model.HasManyRelation,
        modelClass: ScheduleGroup,
        join: {
          from: 'server.id',
          to: 'scheduleGroup.serverId',
        },
      },
    };
  }
}

module.exports = Server;
