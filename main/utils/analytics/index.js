const os = require('os')
const ms = require('ms')
const fetch = require('node-fetch')
const { machineId } = require('node-machine-id')

// Utilities
const config = require('../../../config')
const { getToken } = require('../store')

const sendEvent = async (app, type, additionalData = {}) => {
  const data = Object.assign(
    {
      type,
      machineId: await machineId(),
      appVersion: app.getVersion(),
      os: os.platform(),
      osVersion: os.release(),
    },
    additionalData
  )

  await fetch(`${config.apiUrl}/analytics/event`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })

  console.log(`Event ${type} sent!`)
}

const pingServer = app => sendEvent(app, 'ping', null)

const startPingingServer = app => {
  return setInterval(() => pingServer(app), ms('5m'))
}

exports.sendEvent = sendEvent
exports.pingServer = pingServer
exports.startPingingServer = startPingingServer
