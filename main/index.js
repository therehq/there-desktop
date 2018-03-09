// Packages
const { app, ipcMain, Tray, BrowserWindow } = require('electron')
const { resolve: resolvePath } = require('app-root-path')
const { enforceMacOSAppLocation, is } = require('electron-util')
const prepareRenderer = require('electron-next')
const isDev = require('electron-is-dev')
const firstRun = require('first-run')
const fixPath = require('fix-path')

// Utilities
const {
  trayWindow,
  chatWindow,
  addWindow,
  joinWindow,
} = require('./utils/frames/list')
const { setupSentry, devtools } = require('./utils/setup')
const { innerMenu, outerMenu } = require('./menu')
const {
  store,
  tokenFieldKey,
  getToken,
  setupTokenListener,
} = require('./utils/store')

// Global internal app config
const { devPort } = require('../config')

// Init env variables
const { parsed: envParsed } = require('dotenv').config()
process.env = Object.assign({}, process.env, envParsed)

// Capture errors and unhandled promise rejections
setupSentry()

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null

// Prevent having to check for login status when opening the window
let loggedIn = null

// Check status once in the beginning when the app starting up
// And on change
// We could to this on click on the tray icon, but we
// don't want to block that action
const setLoggedInStatus = () => {
  let token = getToken()
  loggedIn = Boolean(token)
  store.onDidChange(tokenFieldKey, newToken => {
    token = newToken
    loggedIn = Boolean(token)
  })
}
setLoggedInStatus()

// Set the application's name
app.setName('There')

// Make There start automatically on login
if (!isDev && firstRun()) {
  app.setLoginItemSettings({ openAtLogin: true })
}

// Hide dock icon before the app starts
// This is only required for development because
// we're setting a property on the bundled app
// in production, which prevents the icon from flickering
if (isDev && is.macos) {
  app.dock.hide()
}

// Makes sure where inheriting the correct path
// Within the bundled app, the path would otherwise be different
fixPath()

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit()
  }
})

const contextMenu = windows => {
  if (process.env.CONNECTION === 'offline') {
    return outerMenu(app, windows)
  }

  return innerMenu(app, windows)
}

// Chrome Command Line Switches
app.commandLine.appendSwitch('disable-renderer-backgrounding')

app.on('ready', async () => {
  // Setup connect status checker
  const onlineStatusWindow = new BrowserWindow({
    width: 0,
    height: 0,
    show: false,
  })

  onlineStatusWindow.loadURL(
    'file://' + resolvePath('./main/static/pages/status.html')
  )

  ipcMain.on('online-status-changed', (event, status) => {
    process.env.CONNECTION = status
  })

  // Prepare Next development build
  await prepareRenderer('./renderer', devPort)

  // Setup enhanced devtools
  devtools.setupElectronDebug()
  devtools.installExtensions()

  // Enforce macOS app is in Applications folder
  enforceMacOSAppLocation()

  // Create Tray
  try {
    const iconName = is.windows ? 'iconWhite' : 'iconTemplate'
    tray = new Tray(resolvePath(`./main/static/tray/${iconName}.png`))
    tray.setToolTip('There PM')
  } catch (err) {
    return
  }

  // Create windows
  const windows = {
    main: trayWindow(tray),
    chat: chatWindow(tray),
    add: addWindow(tray),
    join: joinWindow(tray),
  }

  // Save it in global object, so
  // we have access to it everywhere
  global.tray = tray
  global.windows = windows

  // If user is not logged in, open the sign in window
  windows.join.once('ready-to-show', () => {
    if (!loggedIn) {
      windows.join.show()
    }
  })

  // If user is not logged in, show the join window on Tray click
  // (We are fighting the `menubar` package events now, I'm considering
  // to handle the tray/postioning logic myself and remove `menubar`)
  tray.on('click', () => {
    if (!loggedIn) {
      windows.join.show()
      windows.main.hide()
    }
  })
  tray.on('double-click', () => {
    if (!loggedIn) {
      windows.join.show()
      windows.main.hide()
    }
  })

  // Handle ipc events
  setupTokenListener(windows)

  ipcMain.on('reload-main', () => {
    windows.main.reload()
  })

  ipcMain.on('open-add', () => {
    windows.add.reload()
    windows.add.once('ready-to-show', () => {
      windows.add.show()
      windows.add.focus()
    })
  })

  ipcMain.on('open-chat', () => {
    windows.chat.show()
  })

  ipcMain.on('open-menu', (event, bounds) => {
    if (bounds && bounds.x && bounds.y) {
      bounds.x = parseInt(bounds.x.toFixed(), 10) + bounds.width / 2
      bounds.y = parseInt(bounds.y.toFixed(), 10) - bounds.height / 2

      const menu = loggedIn ? contextMenu(windows) : outerMenu(app, windows)
      menu.popup({ x: bounds.x, y: bounds.y, async: true })
    }
  })

  // Define major event listeners for tray
  let submenuShown = false

  tray.on('right-click', event => {
    if (windows.main.isVisible()) {
      windows.main.hide()
      return
    }

    const menu = loggedIn ? contextMenu(windows) : outerMenu(app, windows)

    // Toggle submenu
    tray.setHighlightMode('selection')
    tray.popUpContextMenu(submenuShown ? null : menu)
    submenuShown = !submenuShown

    event.preventDefault()
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
