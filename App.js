const Discord = require('discord.js');

const Server = require('./models/Server');
const Schedule = require('./models/Schedule');

const commandError = require('./lib/commandError');
const remindConf = require('./lib/remindConf');
const { scheduleReactionAdd, scheduleReactionmessageEdit, ansers } = require('./lib/scheduleReaction');
const weekly = require('./lib/weekly');
const weeklyConf = require('./lib/weeklyConf');

const { readyCreateJob } = require('./lib/job');

const discordToken = process.env.DISCORD_TOKEN;

const discordClient = new Discord.Client({
  restTimeOffset: 100,
  ws: { intents: ['GUILDS', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] }
});

discordClient.on('ready', async () => {
  readyCreateJob(discordClient);
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

  // const msg = message.content;
  // const channel = message.channel;
  // channel.send(`debag: ${msg}`)
  //   .then(msg => console.log(`Discord: Send (#${message.channel.name}) ${msg}`))
  //   .catch(console.error);
});

discordClient.on('messageReactionAdd', async (messageReaction, user) => {
  const anser = messageReaction.emoji.name;
  if (user.bot || !ansers.includes(anser)) {
    return;
  }
  await messageReaction.users.remove(user);
  const message = messageReaction.message;
  const scheduleId = message.id;
  const userId = user.id;
  const userName = user.username;
  await scheduleReactionAdd(userId, scheduleId, userName, anser);
  await scheduleReactionmessageEdit(message);
});

discordClient.on('messageReactionRemove', async (messageReaction, user) => {
  const anser = messageReaction.emoji.name;
  const schedule = await Schedule.query().findOne({ id: messageReaction.message.id }).catch(() => undefined);
  if (!user.bot || !ansers.includes(anser) || schedule == undefined) {
    return;
  }
  console.log(`Discord: ReactDelete "${user.username}"`);
  try {
    await messageReaction.remove();
    await messageReaction.message.react('⭕');
    await messageReaction.message.react('❌');
    await messageReaction.message.react('❓');
  } catch (err) {
    console.log(err);
  }
});

discordClient.on('messageReactionRemoveAll', async message => {
  const schedule = await Schedule.query().findOne({ id: message.id }).catch(() => undefined);
  if (schedule == undefined) {
    return;
  }
  console.log(`Discord: ReactAllDelete ${message.id}`);
  try {
    await message.react('⭕');
    await message.react('❌');
    await message.react('❓');
  } catch (err) {
    console.log(err);
  }

});


discordClient.on('guildCreate', async (guild) => {
  try {
    const createServer = await Server.query().insert({
      id: guild.id,
      name: guild.name
    });
    console.log(`DB     : Insert Server ${createServer.id} ${guild.name}`);
  } catch (err) {
    console.log(err);
  };
});

discordClient.on('guildDelete', async (guild) => {
  try {
    const deleteServer = await Server.query().deleteById(guild.id);
    console.log(`DB     : Deleted Server ${guild.id} ${guild.name}`);
  } catch (err) {
    console.log(err);
  };
})

discordClient.login(discordToken);
