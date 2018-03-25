/* global windows */

// Modules
const Raven = require('raven')

// Utilities
const { clearCache, setToken } = require('./store')

module.exports = () => {
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
      if (winKey !== 'join') {
        windows[winKey].hide()
      }
    }
  }

  // Clear urql cache thus user details
  try {
    clearCache()
  } catch (e) {
    Raven.captureException(e)
  }

  const joinWindow = windows.join

  // Prepare the login by reloading its contents
  joinWindow.reload()

  // Once the content has loaded again, show it
  joinWindow.once('ready-to-show', () => {
    joinWindow.show()
  })
}
