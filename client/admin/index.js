import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import { ConfigureStore, history } from './configureStore'

import App from './app'
import routes from './routes'

const store = ConfigureStore()
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App>
        {routes}
      </App>
    </Router>
  </Provider>
, document.getElementById('root'))
