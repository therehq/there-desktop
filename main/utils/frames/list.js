// Native
const path = require('path')

// Packages
const electron = require('electron')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')
const menubarLib = require('menubar')

// Utilities
const store = require('../store')
const attachTrayState = require('../highlight')
const { crispWebsiteId, devPort } = require('../../../config')

const windowUrl = page => {
  if (isDev) {
    return `http://localhost:${devPort}/${page}`
  }

  return path.join('file://', resolve('./renderer/out'), page, 'index.html')
}

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
    backgroundColor: '#000',
    webPreferences: {
      backgroundThrottling: false,
    },
  })

  win.loadURL(`https://go.crisp.chat/chat/embed/?website_id=${crispWebsiteId}`)
  attachTrayState(win, tray)

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
      backgroundThrottling: false,
    },
  })

  win.loadURL(windowUrl('add'))
  attachTrayState(win, tray)

  return win
}

exports.joinWindow = tray => {
  const win = new electron.BrowserWindow({
    width: 550,
    height: 400,
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
    },
  })

  win.loadURL(windowUrl('join'))
  attachTrayState(win, tray)

  return win
}

exports.trayWindow = tray => {
  const menuBar = menubarLib({
    tray,
    index: windowUrl('tray'),
    maxWidth: 300,
    minWidth: 300,
    minHeight: 150,
    maxHeight: 600,
    height: store.getWindowHeight(),
    width: 300,
    resizable: true,
    preloadWindow: true,
    hasShadow: true,
    transparent: true,
    frame: false,
    darkTheme: true,
    show: false,
    webPreferences: {
      experimentalFeatures: true,
    },
  })

  const { window } = menuBar

  // Save window height before close
  window.on('close', () => {
    const sizeArray = window.getSize()
    const height = sizeArray.length > 1 ? sizeArray[1] : null

    if (height) {
      store.saveWindowHeight(height)
    }
  })

  return window
}
