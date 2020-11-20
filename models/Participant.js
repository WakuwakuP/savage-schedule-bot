const { Model } = require('./Model');

class Participant extends Model {
  static tableName = 'participant';

  static jsonSchema = {
    required: ['userId', 'scheduleId', 'userName', 'anser'],
    properties: {
      userId: {
        type: "string",
        pattern: "^[0-9]+$"
      },
      scheduleId: {
        type: "string",
        pattern: "^[0-9]+$"
      },
      userName: {
        type: "string",
      },
      anser: {
        type: 'integar',
      },
    },
  };

  static get relationMappings() {
    const Schedule = require('./Schedule');
    return {
      schedule: {
        relation: Model.BelongsToOneRelation,
        modelClass: Schedule,
        join: {
          from: 'participant.scheduleId',
          to: 'schedule.id',
        },
      },
    };
  };
}

module.exports = Participant;
