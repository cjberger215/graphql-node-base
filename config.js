let config;

const shared = {};

const dev = {
  MONGODB_CONNECTION_STRING: 'mongodb://localhost:27017/database-dev',
  APP_SECRET: 'phoney baloney',
};
const test = {
  MONGODB_CONNECTION_STRING: 'mongodb://localhost:27017/database-test',
  APP_SECRET: 'phoney-baloney',
};

switch (process.env.NODE_ENV) {
  case 'dev':
    config = Object.assign(shared, dev);
    break;
  case 'test':
    config = Object.assign(shared, test);
    break;
  default:
    config = Object.assign(shared, dev);
    break;
}

module.exports = {
  config,
};
