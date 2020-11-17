const matchTime = new RegExp('^([01][0-9]|2[0-3]):[0-5][0-9]$');
const matchDate = new RegExp('^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$');

module.exports = {
  matchTime,
  matchDate
}
