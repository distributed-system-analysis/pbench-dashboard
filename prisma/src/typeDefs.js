const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
  }

  type Session {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    config: String!
    description: String
  }

  type Query {
    currentUser: User!
  }

  type Mutation {
    register(firstName: String!, lastName: String!, username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
    createSession(
      createdAt: DateTime!
      updatedAt: DateTime!
      config: String!
      description: String
    ): Session!
  }

  type LoginResponse {
    token: String
    user: User
  }
`;

module.exports = typeDefs;
