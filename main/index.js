const { app, ipcMain } = require('electron')
const unhandled = require('electron-unhandled')
const prepareRenderer = require('electron-next')
const { createTray, chatWindow } = require('./utils/frames/list')

// Global internal app config
const { devPort } = require('../config')

// Init env variables
require('dotenv').config()

// Setup enhanced devtools (React devtools is activated automatically)
require('electron-debug')({ showDevTools: 'undocked' })

// Catch unhandled errors and promise rejections
unhandled()

app.on('ready', async () => {
  // Prepare Next development build
  await prepareRenderer('./renderer', devPort)

  // Create tray window
  const { tray, trayWindow } = createTray()

  const windows = {
    trayWindow,
    chatWindow: chatWindow(tray),
  }

  // Save it in global object, so
  // we have access to it everywhere
  global.tray = tray
  global.windows = windows

  // Handle events
  ipcMain.on('open-chat', () => {
    windows.chatWindow.show()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
