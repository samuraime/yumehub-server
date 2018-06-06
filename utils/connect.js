const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

const connect = () => {
  // reconnect only when initial connect successfully
  mongoose.connect(config.db, {
    autoReconnect: true,
    useMongoClient: true,
    reconnectTries: 30,
    reconnectInterval: 1000,
  })
    .then(() => {
      console.log('connected to %s', config.db);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connect;
