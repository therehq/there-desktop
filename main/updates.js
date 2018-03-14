const autoUpdater = require('electron-updater').autoUpdater
const logger = require('electron-log')
const isDev = require('electron-is-dev')
const Raven = require('raven')
const ms = require('ms')

// Utilities
const notify = require('./notify')

let timeOutSet = false

const updateApp = () => {
  timeOutSet = false
  if (process.env.CONNECTION === 'offline') {
    // We are offline, we stop here and check in 30 minutes
    if (!timeOutSet) {
      setTimeout(updateApp, ms('30m'))
      timeOutSet = true
    }
    return
  }

  // Check for updates and download them
  // then install them on quit
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('error', error => {
    // We report errors to console and send
    // to Sentry as well
    console.log(error)
    Raven.captureException(error)

    // Then check again for updates
    if (!timeOutSet) {
      setTimeout(updateApp, ms('15m'))
      timeOutSet = true
    }
  })

  autoUpdater.on('update-downloaded', ({ version }) => {
    notify({
      title: `Update to ${version} is downloaded!`,
      body: `Click to restart and install now! Or we can install it later.`,
      onClick: () => {
        autoUpdater.quitAndInstall()
      },
    })
  })
}

module.exports = () => {
  if (!isDev) {
    updateApp()
  }

  autoUpdater.logger = logger
  autoUpdater.logger.transports.file.level = 'info'
}
