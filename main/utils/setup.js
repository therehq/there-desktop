const os = require('os')
const Raven = require('raven')

// Utilities
const { getUser } = require('../utils/store')

exports.devtools = {
  setupElectronDebug() {
    const electronDebug = require('electron-debug')
    electronDebug({ showDevTools: 'undocked', enabled: false })
  },
  // Add React and Apollo extensions to the devtools
  installExtensions() {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      APOLLO_DEVELOPER_TOOLS,
    } = require('electron-devtools-installer')
    // Add both extenstions async
    Promise.all([
      installExtension(REACT_DEVELOPER_TOOLS),
      installExtension(APOLLO_DEVELOPER_TOOLS),
    ])
      .then((...names) =>
        console.log(`Added Extension(s):  ${names.join(', ')}`)
      )
      .catch(err => console.log('An error occurred: ', err))
  },
}

exports.setupSentry = app => {
  const user_id = (getUser() || {}).id

  Raven.config('https://83a762162f104b8196ee89a8037e0b27@sentry.io/287684', {
    captureUnhandledRejections: true,
    tags: Object.assign(
      {
        process: process.type,
        electron: process.versions.electron,
        chrome: process.versions.chrome,
        app_version: app ? app.getVersion() : '',
        platform: os.platform(),
        platform_release: os.release(),
      },
      user_id && { user_id }
    ),
  }).install()
}
