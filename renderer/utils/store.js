import Store from 'electron-store'

const defaults = {
  user: {
    isLoggedIn: false,
    displayName: '',
    photoURL: '',
    hasPhoto: false,
    timezone: '',
  },
}

const store = new Store({ defaults })
export default store
