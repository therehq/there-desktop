const os = require('os')
const Mixpanel = require('mixpanel')
const isDev = require('electron-is-dev')
const { machineId: genMachineId } = require('node-machine-id')

// Utilities
const { mixpanelProjectToken } = require('../../config')
const { getUser } = require('../utils/store')

const mixpanel = Mixpanel.init(mixpanelProjectToken)

const track = async (app, event, additionalData, callback) => {
  // I do not ever want to spoil Sentry with useless errors
  try {
    const machineId = await genMachineId()
    const appVersion = app && 'getVersion' in app && app.getVersion()
    const userId = (getUser() || {}).id

    mixpanel.track(
      event,
      Object.assign(
        {
          distinct_id: machineId,
          process: process.type,
          platform: os.platform(),
          platform_release: os.release(),
        },
        !isDev && { appVersion },
        userId && { userId },
        additionalData
      ),
      callback
    )
  } catch (err) {
    return
  }
}

module.exports = {
  instance: mixpanel,
  track,
}
