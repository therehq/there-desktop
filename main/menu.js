// Packages
const {
  Menu: { buildFromTemplate },
  dialog,
  app,
  shell,
} = require('electron')
const { is } = require('electron-util')
const isDev = require('electron-is-dev')

// Utilities
const { whatsNewUrl } = require('../config')
const { clearCache } = require('./utils/store')
const { deleteAccount } = require('./utils/api')
const {
  openChat,
  openUpdateLocation,
  openEditManual,
} = require('./utils/frames/open')
const {
  getUser,
  getDisplayFormat,
  getTimeZoneAutoUpdate,
  getUpdateChannel,
  setUpdateChannel,
  setTimeZoneAutoUpdate,
} = require('./utils/store')
const logout = require('./utils/logout')

const appName = app.getName()
const appVersion = app.getVersion()

const showAboutDialog = updateChannel => {
  dialog.showMessageBox({
    title: `About ${appName}`,
    message: `${appName} ${appVersion} (${updateChannel})`,
    detail: `Created by Mo\nDownload from https://there.pm\nCopyright © 2018 Mohammad Rajabifard.\n\nCredits:\nFlags and some icons made by Freepik from flaticon.com`,
    buttons: [],
  })
}

exports.innerMenu = function(app, tray, windows) {
  const user = getUser()
  const updateChannel = getUpdateChannel()
  const isCanary = updateChannel === 'canary'
  const displayFormat12Hour = getDisplayFormat() === '12h'
  const timeZoneAutoUpdate = getTimeZoneAutoUpdate()
  const { openAtLogin } = app.getLoginItemSettings()
  const isAnonymous = user && user.isAnonymous

  return buildFromTemplate([
    {
      label: is.macos ? `About ${appName}` : 'About',
      click() {
        showAboutDialog(updateChannel)
      },
    },
    {
      type: 'separator',
    },
    isAnonymous
      ? {
          label: `Your backup ID`,
          click() {
            dialog.showMessageBox({
              title: `Unique Backup ID`,
              message: `Here's your unique backup ID`,
              detail: `Your manually added places and people are saved completely anonymous with no clue back to you, unless you give this ID to support to export your data.\n\nYour Unique Backup ID:\n${user.id}`,
              buttons: [],
            })
          },
        }
      : {
          label: user.twitterHandle || user.email || `(no name)`,
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
      click: () => {
        if (!isAnonymous) {
          logout(app)
          return
        }

        const choice = dialog.showMessageBox(windows ? windows.main : null, {
          type: 'question',
          buttons: ['Cancel', `LOG OUT`],
          defaultId: 0,
          title: 'Confirm',
          message: `CAUTION: If you log out of your current session, there's no way you can access this data again. Unless you have saved your 'Unique Backup ID'. If you want to permenatly lose access to this account, click LOG OUT:`,
        })

        if (choice !== 1) {
          return
        }

        logout(app)
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Preferences',
      submenu: [
        {
          label: '12-hour Format',
          type: 'checkbox',
          checked: displayFormat12Hour,
          click() {
            if (windows && windows.main) {
              windows.main.webContents.send('toggle-format')
            }
          },
        },
        {
          label: 'Auto-Update Time Zone',
          type: 'checkbox',
          checked: timeZoneAutoUpdate,
          click() {
            setTimeZoneAutoUpdate(!timeZoneAutoUpdate)
            windows && windows.main && windows.main.reload()
          },
        },
        {
          label: 'Canary Releases',
          type: 'checkbox',
          checked: isCanary,
          click() {
            setUpdateChannel(isCanary ? 'stable' : 'canary')
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
          label: 'Clear Cache...',
          click() {
            clearCache()
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Delete Account...',
          async click() {
            const choice = dialog.showMessageBox(
              windows ? windows.main : null,
              {
                type: 'question',
                buttons: ['Cancel', `DELETE`],
                defaultId: 0,
                title: 'Confirm',
                message: `CAUTION: Deleting your account will permanently remove all your data and it cannot be undone. If you want to proceed, click DELETE:`,
              }
            )

            if (choice !== 1) {
              return
            }

            try {
              // Delete the account
              await deleteAccount()

              // Logout user
              logout()
            } catch (err) {
              dialog.showMessageBox(windows ? windows.main : null, {
                buttons: [`Chat with online support`],
                message: `Couldn't preform account deletation action for some reason, but support agent can do this for you.`,
                detail: err.message,
              })

              openChat(tray, windows, user)
            }
          },
        },
      ],
    },
    {
      type: 'separator',
    },
    {
      label: 'Donate on Patreon',
      click() {
        shell.openExternal(
          `https://www.notion.so/there/Support-Us-By-Donation-dc9c192c2d244d65a0e979ff04300421`
        )
      },
    },
    {
      label: 'Support',
      click() {
        openChat(tray, windows, null)
      },
    },
    {
      label: `What's New?`,
      click() {
        shell.openExternal(whatsNewUrl)
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
  const updateChannel = getUpdateChannel()

  return buildFromTemplate([
    {
      label: is.macos ? `About ${appName}` : 'About',
      click() {
        showAboutDialog(updateChannel)
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

  const template = []

  // User can only edit manually added entries
  if (following.pinned) {
    template.push({
      label: `Unpin`,
      click() {
        windows.main.webContents.send('unpin-following', following)
      },
    })
  } else {
    template.push({
      label: `Pin`,
      click() {
        windows.main.webContents.send('pin-following', following)
      },
    })
  }

  // User can only edit manually added entries
  if (following.__typename !== 'User') {
    template.push({
      label: `Edit`,
      click() {
        openEditManual(windows, following)
      },
    })
  }

  // Remove / Unfollow
  template.push({
    label: action,
    async click() {
      if (!windows) {
        return
      }

      const choice = await dialog.showMessageBox(windows.main, {
        type: 'question',
        buttons: [`Yes, ${action}`, 'Cancel'],
        title: 'Confirm',
        message: `Are you sure you want to ${action.toLowerCase()}?`,
      })

      if (choice.response === 0) {
        windows.main.webContents.send('remove-following', following)
      }
    },
  })

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
