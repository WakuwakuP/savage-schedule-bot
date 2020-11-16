const { Model } = require('./Model');
const ScheduleGroup = require('./ScheduleGroup.js');
const WeeklyConf = require('./WeeklyConf.js');

class Server extends Model {
  static tableName = 'server';

  static jsonSchema = {
    required: ['id'],
    properties: {
      id: {
        type: 'number',
        minimum: 0,
        maximum: 9223372036854775807,
      },
      name: {
        type: 'text',
      }
    }
  }

  static relrationMappings = {
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

module.exports = Server;
