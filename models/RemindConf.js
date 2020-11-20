const { Model } = require('./Model');

class RemindConf extends Model {
  static tableName = 'remindConf';

  static jsonSchema = {
    required: ['serverId', 'advanceNotice', 'noticeChannelId', 'noticeMention'],
    properties: {
      serverId: {
        type: "string",
        pattern: "^[0-9]+$"
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

  static get relationMappings() {
    const Server = require('./Server.js');
    return {
      server: {
        relation: Model.BelongsToOneRelation,
        modelClass: Server,
        join: {
          from: 'remindConf.serverId',
          to: 'server.id',
        },
      },
    };
  };
}


module.exports = RemindConf;
