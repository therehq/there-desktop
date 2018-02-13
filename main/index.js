const { app, ipcMain, Tray } = require('electron')
const { resolve: resolvePath } = require('app-root-path')
const unhandled = require('electron-unhandled')
const prepareRenderer = require('electron-next')
const { enforceMacOSAppLocation } = require('electron-util')

// Utilities
const {
  trayWindow,
  chatWindow,
  addWindow,
  joinWindow,
} = require('./utils/frames/list')
const setupDevTools = require('./utils/setupDevTools')

// Global internal app config
const { devPort } = require('../config')

// Init env variables
const { parsed: envParsed } = require('dotenv').config()
process.env = Object.assign({}, process.env, envParsed)

// Catch unhandled errors and promise rejections
unhandled()

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null

app.on('ready', async () => {
  // Prepare Next development build
  await prepareRenderer('./renderer', devPort)

  // Setup enhanced devtools (React devtools is activated automatically)
  setupDevTools()

  // Enforce macOS app is in Applications folder
  enforceMacOSAppLocation()

  // Create Tray
  try {
    const iconName = process.platform === 'win32' ? 'iconWhite' : 'iconTemplate'
    tray = new Tray(resolvePath(`./main/static/tray/${iconName}.png`))
    tray.setToolTip('There PM')
  } catch (err) {
    return
  }

  // Create windows
  const windows = {
    trayWindow: trayWindow(tray),
    chatWindow: chatWindow(tray),
    addWindow: addWindow(tray),
    joinWindow: joinWindow(tray),
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
