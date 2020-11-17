const { Model } = require('./Model');
const Server = require('./Server.js');

class RemindConf extends Model {
  static tableName = 'remindConf';

  static jsonSchema = {
    required: ['serverId', 'advanceNotice', 'noticeChannelId', 'noticeMention'],
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
        type: 'text',
      },
      noticeChannelName: {
        type: 'text',
      },
      noticeMention: {
        type: 'text',
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
