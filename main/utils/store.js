const Store = require('electron-store')
const store = new Store()

const WINDOW_HEIGHT = 'window-height'

exports.store = store

exports.getStore = () => {
  return store
}

// Window
exports.saveWindowHeight = height => {
  store.set(WINDOW_HEIGHT, height)
}
exports.getWindowHeight = () => store.get(WINDOW_HEIGHT, 300)
