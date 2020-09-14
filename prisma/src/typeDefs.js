const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
  }

  type Url {
    id: ID!
    created: DateTime!
    updated: DateTime!
    config: String!
    description: String
  }

  type Query {
    currentUser: User!
  }

  type Mutation {
    register(firstName: String!, lastName: String!, username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
    createUrl(created: DateTime!, updated: DateTime!, config: String!, description: String!): Url!
  }

  type LoginResponse {
    token: String
    user: User
  }
`;

module.exports = typeDefs;
