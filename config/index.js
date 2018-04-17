const isDev = require('electron-is-dev')

let host
if (process.env.ONLINE_API === '1') {
  host = 'https://api.there.pm'
} else if (process.env.ONLINE_API === '0') {
  host = 'http://localhost:9900'
} else {
  host = isDev ? 'http://localhost:9900' : 'https://api.there.pm'
}

console.log(`🔥 Connecting to server at: ${host}`)

module.exports = {
  devPort: 8008,
  apiUrl: host,
  graphqlEndpoint: `${host}/graphql`,
  restEndpoint: `${host}/rest`,
  crispWebsiteId: `bb14ccd2-0869-40e7-b0f1-b520e93db7e1`,
  sentryDSN: `https://83a762162f104b8196ee89a8037e0b27@sentry.io/287684`,
  GATrackingId: `UA-116027138-1`,
  googleCloudStorage: `https://storage.googleapis.com/there-192619.appspot.com`,
  mixpanelProjectToken: 'e7859c5640d175b8f34d425735fba85e',
}
