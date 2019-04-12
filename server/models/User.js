const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../../config')[process.env.NODE_ENV];

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

  if (!user.isModified('password')) return;

  const passwordDigest = await bcrypt.hash(user.password, SALT_ROUNDS);
  user.password = passwordDigest;
});

UserSchema.statics.signup = async function (newUser) {
  const password = await bcrypt.hash(newUser.password, SALT_ROUNDS);
  const user = await this.create({ password, ...newUser });
  const token = jwt.sign({ userId: user._id }, APP_SECRET);
  return {
    user: Object.assign({}, { password: null }, user),
    token,
  };
};
