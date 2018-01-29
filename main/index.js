const { app } = require('electron')
const menubarLib = require('menubar')
const path = require('path')
const unhandled = require('electron-unhandled')
const prepareRenderer = require('electron-next')
const isDev = require('electron-is-dev')

// Init env variables
require('dotenv').config()

// Get timezone
// const jstz = require('jstz')
// const timezone = jstz.determine()
// console.log(timezone.name())

// Setup enhanced devtools (React devtools is activated automatically)
require('electron-debug')({ showDevTools: 'undocked' })

if (isDev) {
  console.log('[Development Mode]')
}

// Catch unhandled errors and promise rejections
unhandled()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let menuBar

function createWindow() {
  // Get the window page url
  const devPath = 'http://localhost:8008/'
  const prodPath = path.resolve('renderer/out/index.html')
  const entry = isDev ? devPath : 'file://' + prodPath

  // Create menubar window
  menuBar = menubarLib({
    index: entry,
    icon: 'main/assets/iconTemplate.png',

    maxWidth: 300,
    minWidth: 300,
    minHeight: 150,
    maxHeight: 600,
    height: 250,
    width: 300,
    resizable: true,
    preloadWindow: true,
    hasShadow: true,
    transparent: true,
    frame: false,
    darkTheme: true,

    webPreferences: {
      experimentalFeatures: true,
    },
  })

  // const { tray } = menuBar

  // menuBar.window.on('show', () => {
  //   tray.setHighlightMode('always')
  // })

  // menuBar.window.on('hide', () => {
  //   tray.setHighlightMode('never')
  // })

  menuBar.on('ready', () => {
    console.log('app is ready')
  })

  menuBar.on('focus-lost', () => {
    // if (!isDev) {
    menuBar.hideWindow()
    // }
  })

  // Sample second window
  // var prefsWindow = new BrowserWindow({
  //   width: 400,
  //   height: 400,
  //   show: false,
  // })
  // prefsWindow.loadURL(indexPage)

  // ipcMain.on('toggle-prefs', function() {
  //   if (prefsWindow.isVisible()) prefsWindow.hide()
  //   else prefsWindow.show()
  // })
}

app.on('ready', async () => {
  // Prepare Next development build
  await prepareRenderer('./renderer', 8008)

  // Create tray window
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (menuBar === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
