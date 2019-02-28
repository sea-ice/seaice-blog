import {combineReducers} from 'redux'

import gtLoadState from './loadGtReducer'
import validateState from './validateReducer'

export default combineReducers({
  load: gtLoadState,
  validate: validateState
})
