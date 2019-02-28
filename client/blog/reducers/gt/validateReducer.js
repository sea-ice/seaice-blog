const VALIDATE_SUCCESS = 'VALIDATE_SUCCESS'
const VALIDATE_FAIL = 'VALIDATE_FAIL'
const initialState = {}

// action
function validate () {
  return {
    types: [
      null,
      VALIDATE_SUCCESS,
      VALIDATE_FAIL
    ],
    url: ''
  }
}

// reducer
function validateState (state = initialState, action) {
  switch (action.type) {
    case VALIDATE_SUCCESS:
      return {
        data: action.payload
      }
    case VALIDATE_FAIL:
      return {
        err: action.payload
      }
    default:
      return state
  }
}

export {
  validate
}
export default validateState
