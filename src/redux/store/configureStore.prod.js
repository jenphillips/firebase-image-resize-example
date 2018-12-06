import { createStore, applyMiddleware } from 'redux'
import { reactReduxFirebase } from 'react-redux-firebase'
import { reduxFirestore } from 'redux-firestore'

import rootReducer from '../reducers/rootReducer'

import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import { firebaseConfig } from 'config/firebaseConfig'

firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({timestampsInSnapshots: true})

const enhancers = [
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, {
    userProfile: 'users',
    useFirestoreForProfile: true,
    useFirestoreForStorageMeta: true,
  }),
]

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  compose(
    ...enhancers
  )
)

export default configureStore
