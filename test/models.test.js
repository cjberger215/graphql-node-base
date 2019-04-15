const { describe, it, before } = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const { User } = require('../server/models/User');
const { config } = require('../config');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Models', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });
    await User.deleteMany({});
  });
  describe('User', () => {
    it('Should sign up new user', async () => {
      const newUser = { email: 'user01@test.com', password: 'user01rules' };
      const { user } = await User.signup(newUser);
      expect(newUser.email).to.eql(user.email);
      expect(newUser.password).to.not.eql(user.password);
      expect(user._id).to.not.be.null;
    });
    it('Should fail for invalid email', async () => {
      const newUser = { email: 'fakeEmail', password: 'user01rules' };
      expect(User.create(newUser)).to.be.rejectedWith(mongoose.Error.ValidationError);
    });
  });
});
