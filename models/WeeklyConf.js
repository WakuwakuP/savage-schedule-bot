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
      sunday: {
        type: 'string',
        pattern: '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      },
      monday: {
        type: 'string',
        pattern: '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      },
      tuesday: {
        type: 'string',
        pattern: '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      },
      wednesday: {
        type: 'string',
        pattern: '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      },
      thursday: {
        type: 'string',
        pattern: '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      },
      friday: {
        type: 'string',
        pattern: '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      },
      saturday: {
        type: 'string',
        pattern: '^([01][0-9]|2[0-3]):[0-5][0-9]$'
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
