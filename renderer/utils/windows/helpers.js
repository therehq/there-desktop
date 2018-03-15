import electron from 'electron'

export const closeWindowAndShowMain = () => {
  const sender = electron.ipcRenderer || false

  if (!sender) {
    return
  }

  sender.send('reload-main-and-show')
  electron.remote.getCurrentWindow().close()
}
