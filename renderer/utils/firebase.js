import firebase from 'firebase/app'
import 'firebase/auth'

// Fuck Electron
process.env.GOOGLE_API_KEY = process.env.LOCAL_GOOGLE_API_KEY

// Initialize Firebase
const config = {
  apiKey: process.env.LOCAL_GOOGLE_API_KEY,
  authDomain: 'there-192619.firebaseapp.com',
  databaseURL: 'https://there-192619.firebaseio.com',
  projectId: 'there-192619',
  storageBucket: 'there-192619.appspot.com',
  messagingSenderId: '122218890004',
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
