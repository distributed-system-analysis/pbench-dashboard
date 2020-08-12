const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
  }

  type Query {
    currentUser: User!
  }

  type Mutation {
    register(firstName: String!, lastName: String!, username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
  }

  type LoginResponse {
    token: String
    user: User
  }
`;

module.exports = typeDefs;
