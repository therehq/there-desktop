const isDev = require('electron-is-dev')

let host
if (process.env.ONLINE_API === '1') {
  host = 'https://api.there.pm'
} else if (process.env.ONLINE_API === '0') {
  host = 'http://localhost:9900'
} else {
  host = isDev ? 'http://localhost:9900' : 'https://api.there.pm'
}

console.log('Connecting to server at:', host)

module.exports = {
  devPort: 8008,
  crispWebsiteId: `bb14ccd2-0869-40e7-b0f1-b520e93db7e1`,
  apiUrl: host,
  graphqlEndpoint: `${host}/graphql`,
}
