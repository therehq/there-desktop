// Utilities
const { clearCache, setToken } = require('./store')

module.exports = () => {
  // Remove user token immediately
  setToken(null)

  // Hide the main window
  if (windows && windows.main) {
    windows.main.hide()
  }

  // Clear urql cache thus user details
  try {
    clearCache()
  } catch (err) {}

  const joinWindow = windows.join

  // Prepare the login by reloading its contents
  joinWindow.reload()

  // Once the content has loaded again, show it
  joinWindow.once('ready-to-show', () => {
    joinWindow.show()
  })
}
