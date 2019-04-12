const { describe, it, before } = require('mocha');
const { assert } = require('chai');
const mongoose = require('mongoose');
const { User } = require('../server/models/User');
const { config } = require('../config');

describe('Models', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });
  });
  describe('User', () => {
    it('Should sign up new user', async () => {
      const newUser = { email: 'user01@test.com', password: 'user01rules' };
      const user = await User.signup(newUser);
      assert.isNotNull(user);
    });
  });
});
