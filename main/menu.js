// Packages
const { Menu: { buildFromTemplate }, shell } = require('electron')
const { is } = require('electron-util')
const isDev = require('electron-is-dev')

// Utilities
const { getUser } = require('./utils/store')
const logout = require('./utils/logout')

exports.innerMenu = function(app) {
  const user = getUser()
  const { openAtLogin } = app.getLoginItemSettings()

  return buildFromTemplate([
    {
      label: is.macos ? `About ${app.getName()}` : 'About',
      click() {
        console.log(`It's about me!`)
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Account',
      submenu: [
        {
          label: user.twitterHandle,
          enabled: false,
        },
        {
          type: 'separator',
        },
        {
          type: 'separator',
        },
        {
          label: 'Logout',
          click: logout,
        },
      ],
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
        console.log(`It's about me!`)
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
