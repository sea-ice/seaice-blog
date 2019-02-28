import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { createBrowserHistory } from 'history'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { createReduxDevTools } from '../common/utils/components'
import fetch from 'isomorphic-fetch'

import rootReducer from './reducers'

let history = createBrowserHistory()

let FetchMiddleware = ({dispatch, getState}) => next => action => {
  if (
    Object.prototype.toString.call(action.types) !== '[object Array]' ||
    !action.url
  ) return next(action)
  const [LOADING, LOADING_SUCCESS, LOADING_FAILED] = action.types
  if (LOADING) {
    dispatch({
      type: LOADING
    })
  }
  fetch(action.url, action.options).then(response => {
    return response.json()
  }).then(response => {
    if (response.code === 0) {
      // console.log(action.callback)
      console.log('---------')
      console.log(response.data)
      console.log('---------')

      if (
        action.callback &&
        typeof action.callback === 'function'
      ) action.callback(response.data)

      dispatch({
        type: LOADING_SUCCESS,
        payload: response.data
      })
    } else {
      let method = action.options ? action.options.method : 'GET'
      if (response.message) {
        alert(response.message)
      }
      throw new Error(response.message || `${method} ${action.url} failed!`)
    }
  }).catch(err => {
    dispatch({
      type: LOADING_FAILED,
      payload: err
    })
  })
}

const ConfigureStore = (initialState = {}) => {
  let router = routerMiddleware(history)

  let middlewares = [FetchMiddleware, createLogger(), router]

  let ReduxDevTools = process.env.NODE_ENV !== 'production' && createReduxDevTools()
  let store = createStore(combineReducers({
    ...rootReducer,
    router: routerReducer
  }), initialState, compose(
    applyMiddleware(...middlewares),
    ReduxDevTools && ReduxDevTools.instrument()
  ))

  return {
    store,
    ReduxDevTools
  }
}

export {
  ConfigureStore,
  history
}
