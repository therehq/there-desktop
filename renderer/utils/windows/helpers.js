import electron from 'electron'

export const showMainWhenReady = () => {
  const sender = electron.ipcRenderer || false

  if (!sender) {
    return
  }

  sender.send('show-main-when-ready')
}

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

export const reloadMain = () => {
  const sender = electron.ipcRenderer || false

  if (!sender) {
    return
  }

  // Refresh the main window to reflect the change
  sender.send('reload-main')
}

export const openAddWindow = () => {
  const sender = electron.ipcRenderer || false

  if (!sender) {
    return
  }

  sender.send('open-add')
}
