const bcrypt = require('bcryptjs');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const jwt = require('jsonwebtoken');

const resolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return new Date(value); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
  Mutation: {
    login: async (parent, { username, password }, ctx) => {
      const user = await ctx.prisma.user({ username });

      if (!user) {
        throw new Error('Invalid Login');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error('Invalid Login');
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.email,
        },
        'secret-from-env-file-in-prod',
        {
          expiresIn: '30d', // token will expire in 30days
        }
      );
      return {
        token,
        user,
      };
    },
    register: async (parent, { firstName, lastName, username, password }, ctx) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await ctx.prisma.createUser({
        firstName,
        lastName,
        username,
        password: hashedPassword,
      });
      return user;
    },
    createUrl: async (parent, { created, updated, config, description }, ctx) => {
      const url = await ctx.prisma.createUrl({
        created,
        updated,
        config,
        description,
      });
      return url;
    },
  },
};

module.exports = resolvers;
