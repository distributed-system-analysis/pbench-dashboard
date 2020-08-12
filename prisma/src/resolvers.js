const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
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
  },
};

module.exports = resolvers;
