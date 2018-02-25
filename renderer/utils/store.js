import { ipcRenderer } from 'electron'

// Packages
import Store from 'electron-store'

// IPC event channels
const TOKEN_CHANGED_EVENT = 'token-changed'

// Store keys
const URQL_CACHE = 'urql-cache'
export const tokenKey = 'token'

const initialState = {
  [tokenKey]: null,
  user: {},
  [URQL_CACHE]: {},
}

const store = new Store({ defaults: initialState })
export default store

global.electronStore = store

// USER
export const getToken = () => store.get(tokenKey)

export const setToken = newToken => {
  store.set(tokenKey, newToken)
  // Tell the main thread we changed the token
  // so it will notify all windows of the change
  ipcRenderer.send(TOKEN_CHANGED_EVENT, newToken)
}

export const getUser = () => store.set('user')

export const setUser = newUser =>
  store.set('user', { ...getUser(), ...newUser })

export const setUserAndToken = ({ user, token: newToken }) => {
  store.set({ user, [tokenKey]: newToken })
  ipcRenderer.send(TOKEN_CHANGED_EVENT, newToken)
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
  if (key) {
    return store.set(`${URQL_CACHE}.${key}`, value)
  } else {
    // It wants to clear everything!
    return store.set(URQL_CACHE, value)
  }
}

export const deleteUrql = key => store.delete(`${URQL_CACHE}.${key}`)
