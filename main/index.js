const { app, systemPreferences, BrowserWindow, ipcMain } = require('electron')
const menubarLib = require('menubar')
const path = require('path')
const url = require('url')
const unhandled = require('electron-unhandled')

// Init env variables
require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'

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
let isDarkMode = false

function createWindow() {
  isDarkMode = systemPreferences.isDarkMode()
  const indexPage =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '../renderer/out/index.html'),
      protocol: 'file:',
      slashes: true,
    })

  // Create menubar window
  menuBar = menubarLib({
    index: indexPage,
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

    if (systemPreferences.isDarkMode() !== isDarkMode) {
      isDarkMode = !isDarkMode
      menuBar.window.setVibrancy(isDarkMode ? 'dark' : 'popover')
    }
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
