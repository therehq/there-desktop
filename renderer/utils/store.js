// Packages
import electron from 'electron'
import Store from 'electron-store'

// IPC event channels
const TOKEN_CHANGED_EVENT = 'token-changed'

// Store keys
const URQL_CACHE = 'urql-cache'
const COLLAPSED_GROUPS = 'collapsed-groups'
const DISPLAY_FORMAT = 'display-format'
export const tokenKey = 'token'

const initialState = {
  [tokenKey]: null,
  user: {},
  [URQL_CACHE]: {},
}

const safeRemote = electron.remote || false
const store = safeRemote && new Store({ defaults: initialState })
export default store

global.electronStore = store

// USER
export const getToken = () => store && store.get(tokenKey)

export const setToken = newToken => {
  store && store.set(tokenKey, newToken)

  const sender = electron.ipcRenderer || false

  if (!sender) {
    return
  }
  // Tell the main thread we changed the token
  // so it will notify all windows of the change
  sender.send(TOKEN_CHANGED_EVENT, newToken)
}

export const getUser = () => store && store.set('user')

export const setUser = newUser =>
  store && store.set('user', { ...getUser(), ...newUser })

export const setUserAndToken = ({ user, token: newToken }) => {
  store && store.set({ user, [tokenKey]: newToken })

  const sender = electron.ipcRenderer || false

  if (!sender) {
    return
  }

  sender.send(TOKEN_CHANGED_EVENT, newToken)
}

// URQL
export const getUrql = key => {
  if (key) {
    return store.get(`${URQL_CACHE}.${key}`, null)
  } else {
    // It wants the whole cache, give 'em!
    return store.get(URQL_CACHE, {})
  }
}

export const setUrql = (key, value) => {
  if (!store) {
    return
  }

  if (key) {
    return store.set(`${URQL_CACHE}.${key}`, value)
  } else {
    // It wants to clear everything!
    return store.set(URQL_CACHE, value)
  }
}

export const deleteUrql = key => store && store.delete(`${URQL_CACHE}.${key}`)

// Collapsed groups
export const setGroupCollapsed = (groupKey, collapsed = false) => {
  return store && store.set(`${COLLAPSED_GROUPS}.${groupKey}`, collapsed)
}
export const isGroupCollapsed = groupKey => {
  return store && store.get(`${COLLAPSED_GROUPS}.${groupKey}`, null)
}

// Display Format
export const getDisplayFormat = () => store && store.get(DISPLAY_FORMAT, '12h') // 12h or 24h
export const setDisplayFormat = newFormat =>
  store && store.set(DISPLAY_FORMAT, newFormat || '12h')
