import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// Initialize Firebase
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
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
