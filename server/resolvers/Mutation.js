const { User } = require('../models/User');

async function signup(parent, args) {
  return User.signup({ email: args.email, password: args.password });
}

async function login(parent, args) {
  return User.login(args.email, args.password);
}

module.exports = {
  signup,
  login,
};
