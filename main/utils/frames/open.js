// Utitlities
const { crispWebsiteId } = require('../../../config')

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

  windows.chat.show()
}
