const { Model } = require('./Model');
const Server = require('./Server.js');

class RemindConf extends Model {
  static tableName = 'remindConf';

  static jsonSchema = {
    required: ['serverId', 'advanceNotice', 'noticeChannelId'],
    properties: {
      serverId: {
        type: 'number',
        minimum: 0,
      },
      advanceNotice: {
        type: 'number',
        minimum: 0,
      },
      noticeChannelId: {
        type: 'integar',
        minimum: 0,
      },
    },
  };

  static relrationMappings = {
    server: {
      relation: Model.BelongsToOneRelation,
      modelClass: Server,
      join: {
        from: 'remindConf.serverId',
        to: 'server.id',
      },
    },
  }
}


module.exports = RemindConf;
