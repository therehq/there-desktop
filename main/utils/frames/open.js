// Utitlities
const { crispWebsiteId } = require('../../../config')
const {
  windowUrl,
  chatWindow,
  joinWindow,
  editWindow,
  addWindow,
} = require('./list')

exports.openChat = (tray, windows, user) => {
  if (!windows.chat) {
    windows.chat = chatWindow(tray)
  }

  let chatUrl = `https://go.crisp.chat/chat/embed/?website_id=${crispWebsiteId}`
  if (user) {
    // Use a unique identifier for signed in users
    chatUrl = `https://go.crisp.chat/chat/embed/?website_id=${crispWebsiteId}&user_email=${encodeURI(
      user.email
    )}&user_nickname=${encodeURI(user.firstName)}&token_id=${encodeURI(
      user.id
    )}`
  }

  windows.chat.loadURL(chatUrl)
  windows.chat.show()
  windows.chat.focus()
}

exports.openJoin = (tray, windows) => {
  if (!windows.join) {
    windows.join = joinWindow(tray)
    windows.join.loadURL(windowUrl('join'))

    windows.join.once('ready-to-show', () => {
      windows.join.show()
      windows.join.focus()
    })
    return
  }

  // If window is already active, just show/focus on it
  windows.join.show()
  windows.join.focus()
}

exports.openAdd = (tray, windows) => {
  if (!windows.add) {
    windows.add = addWindow(tray)
    windows.add.loadURL(windowUrl('add'))
    windows.add.once('ready-to-show', () => {
      windows.add.show()
      windows.add.focus()
    })
    return
  }

  // If window is already active, just show/focus on it
  windows.add.show()
  windows.add.focus()
}

const openEdit = (propWindows, page, size, customData) => {
  if (!page) {
    return
  }

  const windows = propWindows || global.windows

  if (!windows.edit) {
    windows.edit = editWindow(global.tray)
  }

  if (size && size.width && size.height) {
    const { width, height } = size
    windows.edit.setSize(width, height, true)
  }

  if (customData) {
    windows.edit.customData = customData
  }

  windows.edit.loadURL(windowUrl(page))
  windows.edit.once('ready-to-show', () => {
    windows.edit.show()
    windows.edit.focus()
  })
}
exports.openEdit = openEdit

exports.openUpdateLocation = windows => {
  openEdit(windows, `update-location`, { width: 550, height: 390 })
}

exports.openEditManual = (windows, { __typename, id }) => {
  openEdit(
    windows,
    `edit-manual`,
    { width: 530, height: 320 },
    // Custom data
    { __typename, id }
  )
}
