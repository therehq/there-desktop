import Store from 'electron-store'

const initialState = {
  user: {
    uid: null,
    idToken: null,
    isAnonymous: true,
    displayName: '',
    photoURL: '',
    timezone: '',
  },
}

const store = new Store({ defaults: initialState })
export default store

export const getUser = () => store.get('user')

export const setUser = user => {
  store.set('user', { ...initialState.user, ...getUser(), ...user })
}
