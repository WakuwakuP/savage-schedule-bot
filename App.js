const Discord = require('discord.js');
const schedule = require('node-schedule');
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const Server = require('./models/Server');
dayjs.extend(isSameOrAfter)

const discordToken = process.env.DISCORD_TOKEN;
const matchTime = new RegExp('([01][0-9]|2[0-3]):[0-5][0-9]');
const matchDate = new RegExp('(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])');

const discordClient = new Discord.Client();

let week = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

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

function remindConf(command, message) {
  if (command.length === 1) {
    //TODO: help
  }
  if (command.length === 4) {
    if (command[1].match(/<#[0-9]*>/) && command[2].match(/@.+/) && command[3].match(/[0-9].*/)) {
      remaind = {
        channel: command[1],
        mention: command[2],
        advance: Number(command[3])
      };
      const channelname = message.mentions.channels.last().name;
      message.channel.send('リマインドの設定を変更しました。\n```\nチャンネル: #' + channelname + '\nメンション: ' + remaind.mention + '\n' + remaind.advance + '分前に通知\n```')
        .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
        .catch(console.error);
      return;
    }
  }
  commandError(message, '入力が間違っています');
}

function weeklyConf(command, message) {
  if (command[1] == '--help') {
    message.channel.send('TODO: hogehoge')
      .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
      .catch(console.error);
    return;
  }
  if (command.length === 1) {
    message.channel.send(
      '```\n日: ' + week[0] + '\n月: ' + week[1] + '\n火: ' + week[2] + '\n水: ' + week[3] + '\n木: ' + week[4] + '\n金: ' + week[5] + '\n土: ' + week[6] + '\n```'
    ).then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
      .catch(console.error);
    return;
  }
  if (command.length === 3) {
    if (command[1].match(matchTime) && command[2].match(matchTime)) {
      const holidays = command[1]
      const weekdays = command[2]
      week = [
        holidays,
        weekdays,
        weekdays,
        weekdays,
        weekdays,
        weekdays,
        holidays,
      ];
      message.channel.send('開始時間を設定しました。\n```\n月～金: ' + weekdays + '\n土・日: ' + holidays + '\n```')
        .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
        .catch(console.error);
      return;
    }
  }
  if (command.length === 8) {
    if (command[1].match(matchTime)
      && command[2].match(matchTime)
      && command[3].match(matchTime)
      && command[4].match(matchTime)
      && command[5].match(matchTime)
      && command[6].match(matchTime)
      && command[7].match(matchTime)) {
      const sunday = command[1];
      const monday = command[2];
      const tuesday = command[3];
      const wednesday = command[4];
      const thursday = command[5];
      const friday = command[6];
      const saturday = command[7];
      week = [
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
      ];
      message.channel.send(
        '開始時間を設定しました。\n```\n日: ' + week.sunday + '\n月: ' + week.monday + '\n火: ' + week.tuesday + '\n水: ' + week.wednesday + '\n木: ' + week.thursday + '\n金: ' + week.friday + '\n土: ' + week.saturday + '\n```'
      ).then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
        .catch(console.error);
      return;
    }
  } else {
    commandError(message, '入力が間違っています');
  }
}

function weekly(command, message) {
  if (command[1] == '--help') {
    //TODO: help
    return;
  }

  if (command.length == 2) {
    if (command[1].match(matchDate)) {
      const [m, d] = command[1].split('/').map(d => Number(d));
      const now = new Date();
      const startDate = new Date(now);
      startDate.setMonth(m - 1);
      startDate.setDate(d);
      if (startDate < now) {
        startDate.setFullYear(startDate.getFullYear() + 1);
      }
      for (let i = 0; i < 7; i++) {
        message.channel.send(`${startDate.getMonth() + 1}/${startDate.getDate()} (${weekStr[startDate.getDay()]}) - ${week[startDate.getDay()]}`)
          .then(msg => {
            console.log(`Sent: #${message.channel.name} ${msg}`);
            msg.react('⭕').catch(console.error);
            msg.react('❌').catch(console.error);
            msg.react('❓').catch(console.error);
          }).catch(console.error);
        startDate.setDate(startDate.getDate() + 1);
      }
    } else if (command[1].match(/\+[1-9][0-9].*/)) {
      const date = dayjs(Date.now()).add(Number(command[1]));
      for (let i = 0; i < 7; i++) {
        message.channel.send(`${startDate.getMonth() + 1}/${startDate.getDate()} - ${week[startDate.getDay()]}`)
          .then(msg => {
            console.log(`Sent: #${message.channel.name} ${msg}`);
            msg.react('⭕').catch(console.error);
            msg.react('❌').catch(console.error);
            msg.react('❓').catch(console.error);
          }).catch(console.error);
        startDate.setDate(startDate.getDate() + 1);
      }
    }
  }
}


function commandError(message, errorMessage) {
  message.channel.send(errorMessage)
    .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
    .catch(console.error);
}
