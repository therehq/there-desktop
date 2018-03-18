const semver = require('semver')
const isDev = require('electron-is-dev')
const { getVersion, setVersion, clearCache } = require('./store')

module.exports = app => {
  if (isDev) {
    return
  }

  const appVersion = app.getVersion()
  const storeVersion = getVersion()

  if (!semver.valid(storeVersion)) {
    clearCache()
    setVersion(appVersion)
    return
  }

  if (semver.gt(appVersion, storeVersion)) {
    // Store is older
    clearCache()
    setVersion(appVersion)
    return
  }
}
