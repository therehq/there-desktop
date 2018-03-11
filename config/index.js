// const isDev = require('electron-is-dev')
// const host = isDev ? 'http://localhost:9900' : 'https://api.there.pm'
const host = 'https://api.there.pm'

module.exports = {
  devPort: 8008,
  crispWebsiteId: `bb14ccd2-0869-40e7-b0f1-b520e93db7e1`,
  apiUrl: host,
  graphqlEndpoint: `${host}/graphql`,
}
