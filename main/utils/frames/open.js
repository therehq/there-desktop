// Utitlities
const { crispWebsiteId } = require('../../../config')
const { windowUrl } = require('./list')

exports.openChat = (windows, user) => {
  if (user) {
    const url = `https://go.crisp.chat/chat/embed/?website_id=${crispWebsiteId}&user_email=${encodeURI(
      user.email
    )}&user_nickname=${encodeURI(user.firstName)}&token_id=${encodeURI(
      user.id
    )}`
    windows.chat.loadURL(url)
    windows.chat.once('ready-to-show', () => windows.chat.show())
    return
  }

  windows.chat.loadURL(
    `https://go.crisp.chat/chat/embed/?website_id=${crispWebsiteId}`
  )
  windows.chat.show()
  windows.chat.focus()
}

const openEdit = (windows, page, data = {}) => {
  if (!page) {
    return
  }

  windows.edit.loadURL(windowUrl(page))
  windows.edit.once('ready-to-show', () => {
    windows.edit.show()
    windows.edit.focus()
    windows.edit.customData = data
  })
}
exports.openEdit = openEdit

exports.openUpdateLocation = windows => {
  openEdit(windows, `update-location`)
}
