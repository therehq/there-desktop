const { GraphQLClient } = require('graphql-request')

// Utilities
const { getToken } = require('../store')
const config = require('../../../config')

const token = getToken()

const client = new GraphQLClient(config.graphqlEndpoint, {
  headers: {
    'Content-type': 'application/json',
    Authorization: token ? `Bearer ${token}` : null,
  },
})

exports.deleteAccount = () => {
  const query = `#graphql
    mutation {
      deleteAccount
    }
  `
  return client.request(query)
}
