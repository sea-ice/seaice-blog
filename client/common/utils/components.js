import React from 'react'
import {createDevTools} from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

// import Toast from '../components/Toast'

// export const showToast = (() => {
//   const ToastComponent = <Toast />
//   ReactDOM.render(
//     ToastComponent,
//     document.getElementById('toast-wrapper')
//   )
//   console.log(ToastComponent)
//   return (type, text) => {
//     ToastComponent.show(type, text)
//   }
// })()

export const createLoadingReducer = (initialState, actionTypePrefix) => {
  return (state = initialState, action) => {
    switch (action.type) {
      case actionTypePrefix:
        return {
          loading: true
        }
      case `${actionTypePrefix}_SUCCESS`:
        return {
          loading: false,
          ...action.payload
        }
      case `${actionTypePrefix}_FAILED`:
        return {
          loading: false,
          error: action.payload
        }
      default:
        return state
    }
  }
}

export const createPlainFetchReducer = (initialState, actionTypePrefix) => {
  return (state = initialState, action) => {
    switch(action.type) {
      case `${actionTypePrefix}_SUCCESS`:
        return {
          ...action.payload
        }
      case `${actionTypePrefix}_FAILED`:
        return {
          error: action.payload
        }
      default:
        return state
    }
  }
}

/**
 * 创建redux调试面板
 */
export const createReduxDevTools = () => {
  return createDevTools(<DockMonitor
    toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'
  >
    <LogMonitor></LogMonitor>
  </DockMonitor>)
}
