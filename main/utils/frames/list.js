// Native
const path = require('path')

// Packages
const electron = require('electron')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')
const { menubar } = require('menubar')

// Utilities
const store = require('../store')
const attachTrayState = require('../highlight')
const { devPort } = require('../../../config')

const windowUrl = page => {
  if (isDev) {
    return `http://localhost:${devPort}/${page}`
  }

  return path.join('file://', resolve('./renderer/out'), page, 'index.html')
}

exports.windowUrl = windowUrl

exports.chatWindow = tray => {
  const win = new electron.BrowserWindow({
    width: 320,
    height: 440,
    title: 'Ask There Team!',
    resizable: false,
    center: true,
    show: false,
    fullscreenable: false,
    maximizable: false,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: false,
    },
  })

  attachTrayState(win, tray, 'chat')

  return win
}

exports.addWindow = tray => {
  const win = new electron.BrowserWindow({
    width: 530,
    height: 440,
    title: 'Add (Person or Place)',
    resizable: true,
    center: true,
    show: false,
    frame: false,
    titleBarStyle: 'hiddenInset',
    fullscreenable: false,
    maximizable: true,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: true,
    },
  })

  win.loadURL(windowUrl('add'))
  attachTrayState(win, tray, 'add')

  return win
}

exports.joinWindow = tray => {
  const win = new electron.BrowserWindow({
    width: 550,
    height: 440,
    title: 'Join!',
    resizable: true,
    center: true,
    show: false,
    frame: false,
    titleBarStyle: 'hiddenInset',
    fullscreenable: false,
    maximizable: true,
    backgroundColor: '#fff',
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
    },
  })

  win.loadURL(windowUrl('join'))
  attachTrayState(win, tray, 'join')

  return win
}

exports.editWindow = tray => {
  const win = new electron.BrowserWindow({
    width: 550,
    height: 390,
    title: 'Edit',
    resizable: true,
    center: true,
    show: false,
    frame: false,
    titleBarStyle: 'hiddenInset',
    fullscreenable: false,
    maximizable: true,
    backgroundColor: '#fff',
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
    },
  })

  attachTrayState(win, tray, 'edit')

  return win
}

exports.trayWindow = tray => {
  const menuBar = menubar({
    tray,
    index: windowUrl('tray'),
    windowPosition: 'trayCenter',

    browserWindow: {
      maxWidth: 320,
      minWidth: 320,
      minHeight: 150,
      maxHeight: 750,
      height: store.getWindowHeight(),
      width: 320,
      movable: false,
      resizable: true,
      // preloadWindow: true,
      hasShadow: true,
      transparent: true,
      frame: false,
      center: false,
      darkTheme: true,

      webPreferences: {
        backgroundThrottling: false,
        devTools: true,
        nodeIntegration: true,
      },
    },

    preloadWindow: true,
    show: false,
  })

  // const saveHeight = () => {
  //   const sizeArray = window.getSize()
  //   const height = sizeArray.length > 1 ? sizeArray[1] : null
  //   store.saveWindowHeight(height)
  // }

  // Save window height before close
  // menuBar.window.on('close', saveHeight)
  // menuBar.window.on('hide', saveHeight)

  const { globalShortcut } = electron

  // Global shortcut to open tray window
  globalShortcut.register('CommandOrControl+Shift+Option+J', () => {
    menuBar.window && menuBar.window.isVisible()
      ? menuBar.hideWindow()
      : menuBar.showWindow()
  })

  return menuBar
}
