// Notify all windows / Send an event to all available windows
exports.sendToAll = (windows, event, ...args) => {
  for (winKey in windows) {
    const window = windows[winKey]
    if (window.webContents && window.webContents.send) {
      window.webContents.send(event, ...args)
    }
  }
}
