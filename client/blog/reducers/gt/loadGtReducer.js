import config from '../../../config'

const LOADING_GT = 'LOADING_GT'
const LOAD_GT_SUCCESS = 'LOAD_GT_SUCCESS'
const LOAD_GT_FAIL = 'LOAD_GT_FAIL'
const initialState = {
  loading: true
}

// action
function initializeGt () {
  return {
    types: [
      LOADING_GT,
      LOAD_GT_SUCCESS,
      LOAD_GT_FAIL
    ],
    url: `${config.SERVER_URL}/gt/comment-register`
  }
}

// reducer
function gtLoadState (state = initialState, action) {
  switch (action.type) {
    case LOADING_GT:
      return {
        loading: true
      }
    case LOAD_GT_SUCCESS:
      return {
        loading: false,
        data: action.payload
      }
    case LOAD_GT_FAIL:
      return {
        loading: false,
        err: action.payload
      }
    default:
      return state
  }
}

export {
  initializeGt
}
export default gtLoadState
