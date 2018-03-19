import electron from 'electron'

export const closeWindowAndShowMain = () => {
  const sender = electron.ipcRenderer || false

  if (!sender) {
    return
  }

  sender.send('show-main')
  electron.remote.getCurrentWindow().close()
}

export const closeWindow = () => {
  const remote = electron.remote || false

  if (!remote) {
    return
  }

  remote.getCurrentWindow().close()
}

export const openAddWindow = () => {
  const sender = electron.ipcRenderer || false

  if (!sender) {
    return
  }

  sender.send('open-add')
}
