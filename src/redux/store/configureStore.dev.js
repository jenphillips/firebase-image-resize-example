import { createStore, applyMiddleware, compose } from 'redux'
import { reactReduxFirebase } from 'react-redux-firebase'
import { reduxFirestore } from 'redux-firestore'
import { createLogger } from 'redux-logger'
import DevTools from '../DevTools'

import rootReducer from '../reducers/rootReducer'

import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import { firebaseConfig } from 'config/firebaseConfig'

firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({timestampsInSnapshots: true})

// NOTE:  fileMetadataFactory can be overridden by a custom function
// with the same signature passed to the 'options' argument in
// firebase.uploadFiles, under the key 'metadataFactory'.
// (See Uploader.js for example.)
const enhancers = [
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, {
    userProfile: 'users',
    useFirestoreForProfile: true,
    useFirestoreForStorageMeta: true,
    enableLogging: true,
    fileMetadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
      const { metadata: { name, fullPath } } = uploadRes
      return {
        name,
        fullPath,
        downloadURL
      }
    }
  }),
]

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      ...enhancers,
      applyMiddleware(createLogger()),
      DevTools.instrument()
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/rootReducer', () => {
      store.replaceReducer(rootReducer)
    })
  }

  return store
}

export default configureStore
