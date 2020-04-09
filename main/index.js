// Packages
const {
  app,
  ipcMain,
  Tray,
  Menu,
  BrowserWindow,
  globalShortcut,
  dialog,
} = require('electron')
const { resolve: resolvePath } = require('app-root-path')
const electronUtils = require('electron-util')
const prepareRenderer = require('electron-next')
const isDev = require('electron-is-dev')
const firstRun = require('first-run')
const fixPath = require('fix-path')
const Raven = require('raven')

// Utilities
const { trayWindow } = require('./utils/frames/list')
const { openJoin, openChat } = require('./utils/frames/open')
const { setupSentry, devtools } = require('./utils/setup')
const { appMenu, innerMenu, outerMenu, followingMenu } = require('./menu')
const { listenToEvents } = require('./utils/events')
const {
  store,
  tokenFieldKey,
  getToken,
  setupTokenListener,
} = require('./utils/store')
const mixpanel = require('./utils/mixpanel')
const migrate = require('./utils/migrate')
const autoUpdate = require('./updates')

// Global internal app config
const { devPort } = require('../config')

// Init env variables
require('dotenv').config()

// Check for dev
console.log(`Running in ${isDev ? `development` : `production`} mode...`)

// Capture errors and unhandled promise rejections
setupSentry(app)

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

const contextMenu = (tray, windows) => {
  if (process.env.CONNECTION === 'offline') {
    return outerMenu(app, tray, windows)
  }

  return innerMenu(app, tray, windows)
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

  mixpanel.track(app, 'Open App')

  // Create Tray
  try {
    const iconName = electronUtils.is.windows ? 'iconWhite' : 'iconTemplate'
    tray = new Tray(resolvePath(`./main/static/tray/${iconName}.png`))
    // tray.setToolTip('There PM')
  } catch (err) {
    Raven.captureException(err)
    return
  }

  // Migrate data to current version
  migrate(app)

  // Only allow one instance of Now running
  // at the same time
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    return app.exit()
  }

  // Init menubar
  const menuBar = trayWindow(tray)

  // Save it in global object, so
  // we have access to it everywhere
  global.tray = tray
  global.menuBar = menuBar

  menuBar.on('ready', () => {
    // Create windows
    const windows = {
      main: menuBar.window,
    }

    global.windows = windows

    const onTrayClick = event => {
      windows.main.webContents.send('rerender')

      // When someone doesn't have a right click
      if (event.ctrlKey) {
        onTrayRightClick(event)
        return
      }

      // If user is not logged in, show the join window on Tray click
      // (We are fighting the `menubar` package events now, I'm considering
      // to handle the tray/positioning logic myself and remove `menubar`)
      if (!loggedIn) {
        // Hide the main windows as the `menubar` package doesn't care
        menuBar.hideWindow()
        openJoin(tray, windows)
        return
      }
    }

    tray.on('click', onTrayClick)
    tray.on('double-click', onTrayClick)
    tray.on('drop-text', (event, text) => {
      windows && windows.main && windows.main.send('text-dropped', text)

      ipcMain.once('dropped-text-converted', (event, { message, detail }) => {
        const chosen = dialog.showMessageBox({
          message,
          detail,
          buttons: ['Ok', 'Help'],
          defaultId: 0,
        })

        if (chosen === 1) {
          openChat()
        }
      })
    })

    // Handle ipc events
    setupTokenListener(windows)

    // Add IPC event listeners for opening windows and such
    listenToEvents(app, tray, windows)

    ipcMain.on('open-menu', (event, bounds) => {
      if (bounds && bounds.x && bounds.y) {
        bounds.x = parseInt(bounds.x.toFixed(), 10) + bounds.width / 2
        bounds.y = parseInt(bounds.y.toFixed(), 10) - bounds.height / 2

        const menu = contextMenu(tray, windows)

        menu.popup({ x: bounds.x, y: bounds.y, async: true })
      }
    })

    ipcMain.on('open-following-menu', (event, following, point) => {
      if (point && point.x && point.y) {
        point.x = parseInt(point.x.toFixed(), 10)
        point.y = parseInt(point.y.toFixed(), 10)

        const menu = followingMenu(following, windows)
        menu.popup(windows.main, { x: point.x, y: point.y, async: true })
      }
    })

    const openActivity = async () => {
      if (loggedIn) {
        menuBar.showWindow()
        return
      }

      openJoin(tray, windows)
    }

    app.on('second-instance', () => {
      openActivity()
    })

    const { wasOpenedAtLogin } = app.getLoginItemSettings()

    if (firstRun()) {
      // Show the tutorial as soon as the content has finished rendering
      // This avoids a visual flash
      if (!wasOpenedAtLogin) {
        openJoin(tray, windows)
      }
    } else {
      const mainWindow = windows.main

      if (!(mainWindow && mainWindow.isVisible()) && !wasOpenedAtLogin) {
        // TODO: Should we check ready-to-show?
        menuBar.window.once('ready-to-show', openActivity)
      }
    }

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
      submenuShown = !submenuShown

      event.preventDefault()
    }

    tray.on('right-click', onTrayRightClick)
  })
})

let quitEventSent = false
app.on('before-quit', event => {
  // If we have already sent the event,
  // close and avoid sending again
  if (quitEventSent) {
    return
  }

  // By letting the server know of quit,
  // we can determine the session time
  if (process.env.CONNECTION === 'online') {
    event.preventDefault()
    quitEventSent = true
    mixpanel.track(
      app,
      'Quit App',
      { sessionTime: Date.now() - startupTime },
      () => app.quit()
    )
  }
})

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
