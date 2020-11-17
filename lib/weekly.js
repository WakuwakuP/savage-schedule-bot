module.exports = function weekly(command, message) {
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
    return;
  }
}
