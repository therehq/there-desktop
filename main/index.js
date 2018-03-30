// Packages
const { app, ipcMain, Tray, Menu, BrowserWindow } = require('electron')
const { resolve: resolvePath } = require('app-root-path')
const electronUtils = require('electron-util')
const prepareRenderer = require('electron-next')
const isDev = require('electron-is-dev')
const firstRun = require('first-run')
const fixPath = require('fix-path')
const Raven = require('raven')

// Utilities
const {
  trayWindow,
  chatWindow,
  addWindow,
  joinWindow,
  editWindow,
} = require('./utils/frames/list')
const { setupSentry, devtools } = require('./utils/setup')
const { appMenu, innerMenu, outerMenu, followingMenu } = require('./menu')
const { sendEvent, startPingingServer } = require('./utils/analytics')
const { listenToEvents } = require('./utils/events')
const {
  store,
  tokenFieldKey,
  getToken,
  setupTokenListener,
} = require('./utils/store')
const migrate = require('./utils/migrate')
const autoUpdate = require('./updates')

// Global internal app config
const { devPort } = require('../config')

// Init env variables
require('dotenv').config()

// Check for dev
console.log(`Running in ${isDev ? `development` : `production`} mode...`)

// Capture errors and unhandled promise rejections
setupSentry()

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null

// Prevent having to check for login status when opening the window
let loggedIn = null

// Capture when the app was opened
const startupTime = Date.now()

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

// Ping analytics server
startPingingServer(app)

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
if (isDev && electronUtils.is.macos) {
  app.dock.hide()
}

// Makes sure where inheriting the correct path
// Within the bundled app, the path would otherwise be different
fixPath()

app.on('window-all-closed', () => {
  if (!electronUtils.is.macos) {
    app.quit()
  }
})

const sendAnaylticsEvent = (event, data) => sendEvent(app, event, data)

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

  // Check for updates (and install if available)
  autoUpdate()

  // Prepare Next development build
  await prepareRenderer('./renderer', devPort)

  // Enforce macOS app is in Applications folder
  electronUtils.enforceMacOSAppLocation()

  // Set menu to enable copy & paste
  if (!isDev) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(app)))
  }

  // Setup enhanced devtools
  devtools.setupElectronDebug()
  devtools.installExtensions()

  sendAnaylticsEvent('open')

  // Create Tray
  try {
    const iconName = electronUtils.is.windows ? 'iconWhite' : 'iconTemplate'
    tray = new Tray(resolvePath(`./main/static/tray/${iconName}.png`))
    tray.setToolTip('There PM')
  } catch (err) {
    Raven.captureException(err)
    return
  }

  // Migrate data to current version
  migrate(app)

  // Create windows
  const windows = {
    main: trayWindow(tray),
    chat: chatWindow(tray),
    add: addWindow(tray),
    join: joinWindow(tray),
    edit: editWindow(tray),
  }

  // Save it in global object, so
  // we have access to it everywhere
  global.tray = tray
  global.windows = windows

  // If user is not logged in, open the sign in window
  if (!loggedIn) {
    windows.join.once('ready-to-show', () => {
      windows.join.show()
    })
  }

  const onTrayClick = event => {
    // When someone doesn't have a right click
    if (event.ctrlKey) {
      onTrayRightClick(event)
      return
    }

    // If user is not logged in, show the join window on Tray click
    // (We are fighting the `menubar` package events now, I'm considering
    // to handle the tray/postioning logic myself and remove `menubar`)
    if (!loggedIn) {
      windows.join.show()
      windows.main.hide()
      return
    }

    windows.main.webContents.send('rerender')
  }

  tray.on('click', onTrayClick)
  tray.on('double-click', onTrayClick)

  // Handle ipc events
  setupTokenListener(windows)

  // Add IPC event listeners for opening windows and such
  listenToEvents(app, windows)

  ipcMain.on('open-menu', (event, bounds) => {
    if (bounds && bounds.x && bounds.y) {
      bounds.x = parseInt(bounds.x.toFixed(), 10) + bounds.width / 2
      bounds.y = parseInt(bounds.y.toFixed(), 10) - bounds.height / 2

      const menu = loggedIn ? contextMenu(windows) : outerMenu(app, windows)
      menu.popup({ x: bounds.x, y: bounds.y, async: true })
    }
  })

  ipcMain.on('open-following-menu', (event, following, point) => {
    if (point && point.x && point.y) {
      point.x = parseInt(point.x.toFixed(), 10)
      point.y = parseInt(point.y.toFixed(), 10)

      const menu = followingMenu(following, windows)
      menu.popup({ x: point.x, y: point.y, async: true })
    }
  })

  // Define major event listeners for tray
  let submenuShown = false

  function onTrayRightClick(event) {
    if (windows.main.isVisible()) {
      windows.main.hide()
      return
    }

    const menu = loggedIn ? contextMenu(windows) : outerMenu(app, windows)

    // Toggle submenu
    tray.popUpContextMenu(submenuShown ? null : menu)
    tray.setHighlightMode('selection')
    submenuShown = !submenuShown

    event.preventDefault()
  }

  tray.on('right-click', onTrayRightClick)
})

app.on('before-quit', () => {
  // By letting the server know of quit,
  // we can determine the session time
  if (process.env.CONNECTION === 'online') {
    sendAnaylticsEvent('quit', {
      sessionTime: Date.now() - startupTime,
    })
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
