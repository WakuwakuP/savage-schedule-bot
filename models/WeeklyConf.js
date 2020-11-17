const { Model } = require('./Model');
const Server = require('./Server.js');

class WeeklyConf extends Model {
  static tableName = 'weeklyConf';

  static jsonSchema = {
    required: ['serverId', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    properties: {
      serverId: {
        type: 'number',
        minimum: 0,
      },
    },
  };

  static relrationMappings = {
    server: {
      relation: Model.BelongsToOneRelation,
      modelClass: Server,
      join: {
        from: 'weeklyConf.serverId',
        to: 'server.id',
      },
    },
  }
}


module.exports = WeeklyConf;
