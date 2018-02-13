import firebase from 'firebase/app'
import 'firebase/auth'

import { getUser, setUser } from './store'

export const isAuthorized = () => getUser().uuid !== null

export const guestSignIn = async () => {
  try {
    await firebase.auth().signInAnonymously()
  } catch (e) {
    console.log(e)
  }

  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      const isAnonymous = user.isAnonymous
      const uid = user.uid
      // Update the store with user data
      setUser({
        isAnonymous,
        uid,
      })
    } else {
      // User signed out...
      signOut()
      unsubscribe()
    }
  })
}

export const signOut = () => {
  setUser({
    uid: null,
  })
}
