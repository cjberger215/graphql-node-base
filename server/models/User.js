const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../../config');

const SALT_ROUNDS = 10;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    required: 'Email is required',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  password: {
    type: String,
    minlength: 6,
    required: 'Password is required',
  },
});

UserSchema.pre('save', async function () {
  const user = this;
  user.updated = Date.now();

  if (!user.isModified('password')) return;

  const passwordDigest = await bcrypt.hash(user.password, SALT_ROUNDS);
  user.password = passwordDigest;
});

UserSchema.statics.signup = async function (newUser) {
  const password = await bcrypt.hash(newUser.password, SALT_ROUNDS);
  const user = await this.create({ password, ...newUser });
  const token = jwt.sign({ userId: user._id }, config.APP_SECRET);
  return {
    user,
    token,
  };
};

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error(`No user registered at ${email}`);
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error(`Invalid password for ${email}`);
  }
  const token = jwt.sign({ userId: user._id }, config.APP_SECRET);
  return {
    token,
    user,
  };
};

module.exports = {
  User: model('User', UserSchema),
};
