import Store from 'electron-store'

const initialState = {
  user: {
    uid: null,
    isAnonymous: true,
    displayName: '',
    photoURL: '',
    timezone: '',
  },
}

const store = new Store({ defaults: initialState })
export default store

export const setUser = user => {
  store.set('user', { ...initialState.user, ...user })
}

export const getUser = () => store.get('user')
