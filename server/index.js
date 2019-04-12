const { GraphQLServer } = require('graphql-yoga');
const path = require('path');

const resolvers = {
  Query: {
    info: () => 'This is a basic template for a GraphQL API with user authentication',
  },
};

const server = new GraphQLServer({
  typeDefs: path.join(__dirname, 'schema.graphql'),
  resolvers,
});
server.start(() => console.log('Server is running on http://localhost:4000'));
