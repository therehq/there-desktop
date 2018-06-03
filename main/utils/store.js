const { ipcMain } = require('electron')
const Store = require('electron-store')

// Local
const { sendToAll } = require('./frames/ipc')

const store = new Store()

// IPC channel keys
const LOGGED_IN_CHANGED_CHANNEL = 'logged-in-changed'

// Store keys
const WINDOW_HEIGHT = 'window-height'
const URQL_CACHE = 'urql-cache'
const CONFIG = 'config'
const USER = 'user'
const VERSON = 'version'
const DISPLAY_FORMAT = 'display-format'
const UPDATE_CHANNEL = 'update-channel'
const TIME_ZONE_AUTO_UPDATE = 'timzone-auto-update'

exports.store = store

exports.getStore = () => {
  return store
}

// Config
exports.getConfig = () => store.get(CONFIG)

// Window
exports.saveWindowHeight = height => {
  store.set(WINDOW_HEIGHT, height)
}
exports.getWindowHeight = () => store.get(WINDOW_HEIGHT, 300)

// Version
exports.getVersion = () => store.get(VERSON, '1.0.0')
exports.setVersion = newV => store.set(VERSON, newV)

// Update Channel
exports.getUpdateChannel = () => store.get(UPDATE_CHANNEL, 'stable')
exports.setUpdateChannel = c => store.set(UPDATE_CHANNEL, c)

// Timezone auto-update
exports.getTimeZoneAutoUpdate = () => store.get(TIME_ZONE_AUTO_UPDATE, true)
exports.setTimeZoneAutoUpdate = c => store.set(TIME_ZONE_AUTO_UPDATE, c)

// User
const tokenFieldKey = `token`
exports.tokenFieldKey = tokenFieldKey
exports.getUser = () => store.get(USER)
exports.getToken = () => store.get(tokenFieldKey)
exports.setToken = newToken => {
  store.set(tokenFieldKey, newToken)
  // Notify all available windows
  sendToAll(global.windows, LOGGED_IN_CHANGED_CHANNEL, Boolean(newToken))
}

// Setup event handling for token
exports.setupTokenListener = windows => {
  ipcMain.on('token-changed', (e, newToken) => {
    // Notify all available windows
    sendToAll(windows, LOGGED_IN_CHANGED_CHANNEL, Boolean(newToken))
    // Needs a change to call onDidChange in the main thread
    store.set(tokenFieldKey, newToken)
    // Reload main window on token change
    if (windows && windows.main) {
      windows.main.reload()
    }
  })
}

// Display Format
exports.getDisplayFormat = () => store.get(DISPLAY_FORMAT, '12h') // 12h or 24h
exports.setDisplayFormat = newFormat => store.set(DISPLAY_FORMAT, newFormat)

// Urql
exports.clearCache = () => store.delete(URQL_CACHE)
