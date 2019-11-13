const { buildSchema } = require('graphql')

module.exports = buildSchema(`        
type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String
}

type AuthData {
    userId: ID!
    firstName: String!
    lastName: String!
    email: String!
    token: String!
    tokenExpiration: Int!
}

input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
}
type RootQuery {
    getUser: [User!]!,
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createUser(userInput: UserInput): User
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)