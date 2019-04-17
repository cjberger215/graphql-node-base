const { describe, it, before } = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const { User } = require('../server/models/User');
const { config } = require('../config');

chai.use(chaiAsPromised);
const { expect } = chai;

const testUser = { email: 'user00@test.com', password: 'user00rules' };

describe('Models', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });
    await User.deleteMany({});
    const { user } = await User.signup(testUser);
    testUser._id = user._id.toString();
  });
  describe('User', () => {
    describe('Signup', () => {
      it('Should sign up new user', async () => {
        const newUser = { email: 'user01@test.com', password: 'user01rules' };
        const { user } = await User.signup(newUser);
        expect(newUser.email).to.eql(user.email);
        expect(newUser.password).to.not.eql(user.password);
        expect(user._id).to.not.be.null;
      });
      it('Should fail for invalid email', async () => {
        const newUser = { email: 'fakeEmail', password: 'user01rules' };
        expect(User.signup(newUser)).to.be.rejectedWith(mongoose.Error.ValidationError);
      });
      it('Should fail for invalid password', async () => {
        const newUser = { email: 'user02@test.com', password: '123' };
        expect(User.signup(newUser)).to.be.rejectedWith(mongoose.Error.ValidationError);
      });
      it('Should fail to create account for existing email', async () => {
        const newUser = { email: testUser.email, password: 'goodpassword1' };
        expect(User.signup(newUser)).to.be.rejectedWith(Error);
      });
    });
    describe('Login', () => {
      it('Should log in existing user with correct email/password', async () => {
        const { token } = await User.login(testUser.email, testUser.password);
        expect(token).to.not.be.null;
      });
      it('Should fail to login user with incorrect password', async () => {
        expect(User.login(testUser.email, 'wrongPassword')).to.be.rejectedWith(Error);
      });
    });
    describe('Authenticate', () => {
      it('Should authenticate user with proper auth token', async () => {
        const { token } = await User.login(testUser.email, testUser.password);
        const userId = User.authenticate(token);
        expect(userId).to.eql(testUser._id);
      });
      it('Should throw error for invalid auth token', () => {
        expect(User.authenticate.bind(User, 'phoneybaloney')).to.throw();
      });
    });
  });
});
