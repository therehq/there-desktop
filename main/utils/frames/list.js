// Native
const path = require('path')

// Packages
const electron = require('electron')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')
const menubarLib = require('menubar')

// Utilities
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

exports.createTray = () => {
  const menuBar = menubarLib({
    index: windowUrl('tray'),
    icon: 'main/assets/iconTemplate.png',
    tooltip: 'There app',
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
    show: false,
    webPreferences: {
      experimentalFeatures: true,
    },
  })

  const { window, tray } = menuBar
  return { window, tray }
}
