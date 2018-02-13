const electronDebug = require('electron-debug')
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  APOLLO_DEVELOPER_TOOLS,
} = require('electron-devtools-installer')

const setupElectronDebug = () => {
  electronDebug({ showDevTools: 'undocked', enabled: false })
}

const installExtensions = () => {
  Promise.all([
    installExtension(REACT_DEVELOPER_TOOLS),
    installExtension(APOLLO_DEVELOPER_TOOLS),
  ])
    .then((...names) => console.log(`Added Extension(s):  ${names.join(', ')}`))
    .catch(err => console.log('An error occurred: ', err))
}

module.exports = () => {
  setupElectronDebug()
  installExtensions()
}
