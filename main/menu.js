// Packages
const { Menu: { buildFromTemplate }, shell, dialog } = require('electron')
const { is } = require('electron-util')
const isDev = require('electron-is-dev')

// Utilities
const { getUser } = require('./utils/store')
const logout = require('./utils/logout')

const showAboutDialog = app => {
  dialog.showMessageBox(null, {
    type: 'info',
    buttons: ['Done'],
    title: 'About',
    message: `There PM (${app.getVersion()})\nCopyright (C) 2018 There. All rights reserved`,
  })
}

exports.innerMenu = function(app) {
  const user = getUser()
  const { openAtLogin } = app.getLoginItemSettings()

  return buildFromTemplate([
    {
      label: is.macos ? `About ${app.getName()}` : 'About',
      click() {
        showAboutDialog(app)
      },
    },
    {
      type: 'separator',
    },
    {
      label: user.twitterHandle,
      enabled: false,
    },
    {
      label: 'Logout',
      click: logout,
    },
    {
      type: 'separator',
    },
    {
      label: 'Support',
      click() {
        shell.openExternal('mailto:support@there.pm')
      },
    },
    {
      label: 'Website',
      click() {
        shell.openExternal('https://there.pm/')
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Launch at Login',
      type: 'checkbox',
      checked: openAtLogin,
      enabled: !isDev,
      click() {
        app.setLoginItemSettings({
          openAtLogin: !openAtLogin,
        })
      },
    },
    {
      type: 'separator',
    },
    {
      role: 'quit',
      accelerator: 'Cmd+Q',
    },
  ])
}

exports.outerMenu = function(app) {
  return buildFromTemplate([
    {
      label: is.macos ? `About ${app.getName()}` : 'About',
      click() {
        showAboutDialog(app)
      },
    },
    {
      type: 'separator',
    },
    {
      role: 'quit',
      accelerator: 'Cmd+Q',
    },
  ])
}

exports.followingMenu = (following, windows) => {
  return buildFromTemplate([
    {
      label: following.__typename === 'User' ? `Unfollow` : `Remove`,
      click() {
        if (windows && windows.main) {
          windows.main.webContents.send('remove-following', following)
        }
      },
    },
  ])
}
