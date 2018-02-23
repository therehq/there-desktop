import Store from 'electron-store'

const URQL_CACHE = 'urql-cache'
const initialState = {
  user: {
    uid: null,
    idToken: null,
    isAnonymous: true,
    displayName: '',
    photoURL: '',
    timezone: '',
  },
  [URQL_CACHE]: {},
}

const store = new Store({ defaults: initialState })
export default store

export const getUser = () => store.get('user')

export const setUser = user => {
  store.set('user', { ...initialState.user, ...getUser(), ...user })
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
