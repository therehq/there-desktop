import { getUrql, setUrql, deleteUrql } from '../store'

export const electronStoreCache = () => {
  return {
    invalidate: hash =>
      new Promise(resolve => {
        deleteUrql(hash)
        resolve()
      }),
    invalidateAll: () =>
      new Promise(resolve => {
        setUrql(undefined, {}) // undefined means to set the cache value as a whole
        resolve()
      }),
    read: hash =>
      new Promise(resolve => {
        resolve(getUrql(hash))
      }),
    update: callback =>
      new Promise(resolve => {
        if (typeof callback === 'function') {
          const store = getUrql() // Get everything
          Object.keys(store).map(key => {
            callback(store, key, store[key])
          })
        }
        resolve()
      }),
    write: (hash, data) =>
      new Promise(resolve => {
        setUrql(hash, data)
        resolve()
      }),
  }
}
