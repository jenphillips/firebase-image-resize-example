import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import './index.css';
import './util.css';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import Root from 'Root'
import { store } from 'redux/store/store'

ReactDOM.render(
  <BrowserRouter>
    <Root store={store}/>
  </BrowserRouter>,
  document.getElementById('root')
);

registerServiceWorker();
