// Local
import firebase from './firebase'
import { getUser, setUser } from './store'
import { asyncErrorHandler } from './errorHandlers'

export const checkIsAuthorized = () => getUser().uid !== null

export const anonymousSignIn = async () => {
  try {
    console.log('Sigining in anonymously...')
    await firebase.auth().signInAnonymously()
  } catch (e) {
    console.log(e)
    return
  }

  const unsubscribe = firebase.auth().onAuthStateChanged(
    asyncErrorHandler(async user => {
      if (user) {
        // User is signed in.
        const uid = user.uid
        const idToken = await user.getIdToken(true)
        const isAnonymous = user.isAnonymous || true
        // Update the store with user data
        setUser({
          uid,
          idToken,
          isAnonymous,
        })
      } else {
        // User signed out...
        console.log('Signing out...')
        signOut()
        unsubscribe()
      }
    })
  )
}

export const signOut = () => {
  setUser({
    uid: null,
  })
}

export const getToken = () => getUser().idToken

export const getTokenFromFirebase = asyncErrorHandler(async () => {
  const token = await firebase.auth().currentUser.getIdToken(false)
  return token
})
