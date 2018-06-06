const path = require('path');
const winston = require('winston');

const logger = new winston.Logger({
  transports: ['error', 'info'].map(level => new winston.transports.File({
    name: `${level}-file`,
    filename: path.join(__dirname, `../logs/${level}.log`),
    level,
  })),
});

module.exports = logger;
