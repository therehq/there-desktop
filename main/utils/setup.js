const os = require('os')
const Raven = require('raven')

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

exports.setupSentry = () => {
  const PRIVATE_SENTRY_DSN =
    'https://2659a1e4dfb14debb5efd5f2626d69b9:facc03b7a6f9440b80c90c18f9029d93@sentry.io/287684'

  Raven.config(PRIVATE_SENTRY_DSN, {
    captureUnhandledRejections: true,
    tags: {
      process: process.type,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      platform: os.platform(),
      platform_release: os.release(),
    },
  }).install()
}
