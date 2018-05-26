const { GraphQLClient } = require('graphql-request')

// Utilities
const { getToken } = require('../store')
const config = require('../../../config')

const token = getToken()

console.log(config.graphqlEndpoint)
const client = new GraphQLClient(config.graphqlEndpoint, {
  headers: {
    'Content-type': 'application/json',
    Authorization: token ? `Bearer ${token}` : null,
  },
})

exports.deleteAccount = async () => {
  const query = `#graphql
    mutation {
      deleteAccount
    }
  `
  return client.request(query)
}
