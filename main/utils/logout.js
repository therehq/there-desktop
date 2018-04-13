/* global windows */

// Modules
const Raven = require('raven')

// Utilities
const { clearCache, setToken } = require('./store')
const { openJoin } = require('./frames/open')
const mixpanel = require('./mixpanel')

module.exports = app => {
  // Remove user token immediately
  setToken(null)

  // Hide the main window
  if (windows && windows.main) {
    windows.main.reload()
    windows.main.hide()
  }

  // Close all windows
  if (windows) {
    for (let winKey in windows) {
      if (winKey !== 'join' && winKey !== 'main') {
        const win = windows[winKey]
        if (!win) {
          continue
        }

        win.close()
      }
    }
  }

  // Clear urql cache thus user details
  try {
    clearCache()
  } catch (e) {
    Raven.captureException(e)
  }

  // Show the login window
  openJoin(global.tray, windows)

  // Track the logout
  mixpanel.track(app, 'Logout')
}
