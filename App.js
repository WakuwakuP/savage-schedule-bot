const Discord = require('discord.js');
const schedule = require('node-schedule');
const dayjs = require('dayjs');
const { transaction } = require('objection');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter)

const Server = require('./models/Server');

const commandError = require('./lib/commandError');
const remindConf = require('./lib/remindConf');
const weekly = require('./lib/weekly');
const weeklyConf = require('./lib/weeklyConf');

const discordToken = process.env.DISCORD_TOKEN;
const matchTime = new RegExp('([01][0-9]|2[0-3]):[0-5][0-9]');
const matchDate = new RegExp('(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])');

const discordClient = new Discord.Client();

const weekStr = ['日', '月', '火', '水', '木', '金', '土'];

let remaind = {
  channel: '',
  mention: '',
  advance: 0,
};

// const mongoClient = new mongodb.MongoClient(process.env.MONGO_HOST, 27017);

discordClient.on('ready', () => {
  console.log('ready......');
});

discordClient.on('message', message => {
  if (message.author.bot) {
    return;
  }

  if (message.content.match(/\/ssb\s/)) {
    const command = message.content.replace('/ssb ', '').split(' ');
    message.delete();
    switch (command[0]) {
      case 'help':
        break;
      case 'weeklyconf':
        weeklyConf(command, message);
        break;
      case 'weekly':
        weekly(command, message);
        break;
      case 'remindconf':
        remindConf(command, message);
        break;
      default:
        commandError(message, 'error');
        break;
    }
  }

  const msg = message.content;
  const channel = message.channel;
  channel.send(`debag: ${msg}`)
    .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
    .catch(console.error);
});

// discordClient.on("messageReactionAdd", messageReaction => {
//   if (messageReaction.author.bot) {
//     return;
//   }
// });

// discordClient.on("messageReactionRemove", messageReaction => {
//   if (messageReaction.author.bot) {
//     return;
//   }
// });

discordClient.on('guildCreate', async (guild) => {
  try {
    const createServer = await Server.query().insert({
      id: Number(guild.id),
      name: guild.name
    });
    console.log(`JOIN: ${guild.name}(${createServer.id})`);
  } catch (err) {
    console.log(err);
  };
});

discordClient.on('guildDelete', async (guild) => {
  try {
    const deleteServer = await Server.query().deleteById(guild.id);
    console.log(`LEAVE: ${guild.name}(${guild.id}) deleted column: ${deleteServer}`);
  } catch (err) {
    console.log(err);
  };
})

discordClient.login(discordToken);
