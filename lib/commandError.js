module.exports = function commandError(message, errorMessage) {
  message.channel.send(errorMessage)
    .then(msg => console.log(`Sent: #${message.channel.name} ${msg}`))
    .catch(console.error);
};

