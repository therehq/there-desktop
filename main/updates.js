const autoUpdater = require('electron-updater').autoUpdater
const logger = require('electron-log')
const isDev = require('electron-is-dev')
const Raven = require('raven')
const ms = require('ms')

// Utilities
const notify = require('./notify')

// Set GH_TOKEN for authenticated repo read
process.env.GH_TOKEN = 'e0edcd2545fe66a93659502bab4aa4be3e7e9698'

const updateApp = async () => {
  if (process.env.CONNECTION === 'offline') {
    // We are offline, we stop here and check in 30 minutes
    setTimeout(updateApp, ms('30m'))
    return
  }

  try {
    // Check for updates and download them
    // then install them on quit
    await autoUpdater.checkForUpdates()
  } catch (e) {
    console.error(e)
    Raven.captureException(e)
  }
}

module.exports = () => {
  if (!isDev) {
    updateApp()
  }

  autoUpdater.logger = logger
  autoUpdater.logger.transports.file.level = 'info'

  autoUpdater.on('error', error => {
    // We report errors to console and send
    // to Sentry as well
    console.log(error)
    Raven.captureException(error)

    // Then check again for updates
    setTimeout(updateApp, ms('15m'))
  })

  autoUpdater.on('update-downloaded', ({ version }) => {
    notify({
      title: `Update to ${version || 'latest version'} is downloaded!`,
      body: `Click to install and relaunch now! (Or we'll do it later)`,
      onClick: () => {
        autoUpdater.quitAndInstall()
      },
    })
  })
}
