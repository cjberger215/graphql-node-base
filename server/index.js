const { GraphQLServer } = require('graphql-yoga');
const path = require('path');
const mongoose = require('mongoose');
const { config } = require('../config');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const User = require('./resolvers/User');

const resolvers = {
  Query,
  Mutation,
  User,
};

const server = new GraphQLServer({
  typeDefs: path.join(__dirname, 'schema.graphql'),
  resolvers,
});

mongoose.connect(config.MONGODB_CONNECTION_STRING, { useNewUrlParser: true }).then(() => {
  server.start(() => console.log('Server is running on http://localhost:4000'));
});
