const { ipcMain } = require('electron')

// Utilities
const { openChat, openUpdateLocation } = require('./frames/open')

exports.listenToEvents = (app, windows) => {
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
    windows.main.show()
    windows.main.focus()
  })

  ipcMain.on('open-add', () => {
    if (windows.add.isVisible()) {
      windows.add.focus()
      return
    }

    windows.add.reload()
    windows.add.once('ready-to-show', () => {
      windows.add.show()
      windows.add.focus()
    })
  })

  ipcMain.on('open-chat', (event, user) => {
    openChat(windows, user)
  })

  ipcMain.on('open-update-location', () => {
    openUpdateLocation(windows)
  })
}
