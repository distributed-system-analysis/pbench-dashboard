const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const { prisma } = require('./generated/prisma-client/index');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

server
  .listen({
    port: 8383,
  })
  // eslint-disable-next-line no-console
  .then(info => console.log(`Server started on http://localhost:${info.port}`));
