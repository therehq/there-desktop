const { ipcMain } = require('electron')

// Utilities
const { openChat, openUpdateLocation, openAdd } = require('./frames/open')

exports.listenToEvents = (app, tray, windows) => {
  ipcMain.on('reload-main', () => {
    windows.main.reload()
  })

  ipcMain.on('reload-main-and-show', () => {
    windows.main.reload()
    windows.main.once('ready-to-show', () => {
      windows.main.show()
      windows.main.focus()
    })
  })

  ipcMain.on('show-main', () => {
    global.menuBar.showWindow()
  })

  ipcMain.on('show-main-when-ready', () => {
    if (global.menuBar.window) {
      global.menuBar.window.once('ready-to-show', () => {
        global.menuBar.showWindow()
      })
      return
    }

    global.menuBar.showWindow()
  })

  ipcMain.on('open-add', () => {
    openAdd(tray, windows)
  })

  ipcMain.on('open-chat', (event, user) => {
    openChat(tray, windows, user)
  })

  ipcMain.on('open-update-location', () => {
    openUpdateLocation(windows)
  })
}
