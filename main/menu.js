// Packages
const { Menu: { buildFromTemplate }, dialog, app } = require('electron')
const { is } = require('electron-util')
const isDev = require('electron-is-dev')

// Utilities
const { clearCache } = require('./utils/store')
const {
  openChat,
  openUpdateLocation,
  openEditManual,
} = require('./utils/frames/open')
const { getUser, getDisplayFormat } = require('./utils/store')
const logout = require('./utils/logout')

const appName = app.getName()
const appVersion = app.getVersion()

const showAboutDialog = () => {
  dialog.showMessageBox({
    title: `About ${appName}`,
    message: `${appName} ${appVersion} (stable)`,
    detail: `Created by Mo\nCopyright © 2018 Mohammad Rajabifard.`,
    buttons: [],
  })
}

exports.innerMenu = function(app, tray, windows) {
  const user = getUser()
  const displayFormat12Hour = getDisplayFormat() === '12h'
  const { openAtLogin } = app.getLoginItemSettings()

  return buildFromTemplate([
    {
      label: is.macos ? `About ${app.getName()}` : 'About',
      click() {
        showAboutDialog()
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
      label: 'Your Location',
      click: () => {
        openUpdateLocation(windows)
      },
    },
    {
      label: 'Logout',
      click: () => logout(app),
    },
    {
      type: 'separator',
    },
    {
      label: 'Clear Cache',
      click() {
        clearCache()
      },
    },
    {
      label: 'Support',
      click() {
        openChat(tray, windows, null)
      },
    },
    {
      type: 'separator',
    },
    {
      label: '12-hour format',
      type: 'checkbox',
      checked: displayFormat12Hour,
      click() {
        if (windows && windows.main) {
          windows.main.webContents.send('toggle-format')
        }
      },
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
      accelerator: 'CmdOrCtrl+Q',
    },
  ])
}

exports.outerMenu = function(app, tray, windows) {
  return buildFromTemplate([
    {
      label: is.macos ? `About ${app.getName()}` : 'About',
      click() {
        showAboutDialog()
      },
    },
    {
      label: 'Support',
      click() {
        openChat(tray, windows, null)
      },
    },
    {
      type: 'separator',
    },
    {
      role: 'quit',
      accelerator: 'CmdOrCtrl+Q',
    },
  ])
}

exports.followingMenu = (following, windows) => {
  const action = following.__typename === 'User' ? `Unfollow` : `Remove`

  const template = [
    {
      label: action,
      click() {
        if (!windows) {
          return
        }

        const choice = dialog.showMessageBox(windows.main, {
          type: 'question',
          buttons: [`Yes, ${action}`, 'Cancel'],
          title: 'Confirm',
          message: `Are you sure you want to ${action.toLowerCase()}?`,
        })

        if (choice === 0) {
          windows.main.webContents.send('remove-following', following)
        }
      },
    },
  ]

  // User can only edit manually added entries
  if (following.__typename !== 'User') {
    template.push({
      label: `Edit`,
      click() {
        openEditManual(windows, following)
      },
    })
  }

  return buildFromTemplate(template)
}

exports.appMenu = () => {
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.reload()
            }
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform === 'darwin') return 'Ctrl+Command+F'
            else return 'F11'
          })(),
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          },
        },
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close',
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          role: 'quit',
        },
      ],
    },
  ]

  // Enable developer tools
  template[1].submenu.push({
    label: 'Toggle Devtools',
    accelerator: (function() {
      if (process.platform === 'darwin') return 'Alt+Command+J'
      else return 'Ctrl+Shift+J'
    })(),
    click: function(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    },
  })

  return template
}
