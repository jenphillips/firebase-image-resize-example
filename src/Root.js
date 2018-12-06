import React from 'react';
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux'

import App from './App';
import DevTools from 'redux/DevTools'

const Root = ({ store }) => {
  let devTools
  if (process.env.NODE_ENV === 'development') {
    devTools = <DevTools />
  }

  return (
    <Provider store={store}>
      <div>
        <Route path="/" component={App} />
        { devTools }
      </div>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root
