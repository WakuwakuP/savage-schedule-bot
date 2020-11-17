const { Model } = require('./Model');
const Schedule = require('./Schedule');

class Participant extends Model {
  static tableName = 'participant';

  static jsonSchema = {
    required: ['id', 'scheduleId', 'anser'],
    properties: {
      id: {
        type: 'number',
        minimum: 0,
      },
      scheduleId: {
        type: 'Number',
        minimum: 0,
      },
      anser: {
        type: 'integar',
      },
    },
  };

  static relrationMappings = {
    server: {
      relation: Model.BelongsToOneRelation,
      modelClass: Schedule,
      join: {
        from: 'participant.scheduleId',
        to: 'schedule.id',
      },
    },
  };
}

module.exports = Participant;
