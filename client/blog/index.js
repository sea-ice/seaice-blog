import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import { ConfigureStore, history } from './configureStore'

import App from './app'
import configureRoutes from './routes'

const {store, ReduxDevTools} = ConfigureStore()

configureRoutes().then(routes => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <div>
          <App>
            {routes}
          </App>
          {ReduxDevTools && <ReduxDevTools />}
        </div>
      </Router>
    </Provider>
  , document.getElementById('root'))
})
