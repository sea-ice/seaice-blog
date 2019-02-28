import {combineReducers} from 'redux'

import config from '../../config'
import {
  createLoadingReducer,
  createPlainFetchReducer
} from '../../common/utils/components'

const postCommonOptions = postData => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
})

const getAllTagsInitialState = {
  loading: false
}
const LOADING_ALL_TAGS = 'LOADING_ALL_TAGS'
const LOADING_ALL_TAGS_SUCCESS = 'LOADING_ALL_TAGS_SUCCESS'
const LOADING_ALL_TAGS_FAILED = 'LOADING_ALL_TAGS_FAILED'

function getAllTags (callback) {
  return {
    types: [
      LOADING_ALL_TAGS,
      LOADING_ALL_TAGS_SUCCESS,
      LOADING_ALL_TAGS_FAILED
    ],
    url: `${config.SERVER_URL}/tags`,
    callback
  }
}
const getAllTagsState = createLoadingReducer(
  getAllTagsInitialState,
  LOADING_ALL_TAGS
)


const SAVING_DRAFT = 'SAVING_DRAFT'
const SAVE_DRAFT_SUCCESS = 'SAVE_DRAFT_SUCCESS'
const SAVE_DRAFT_FAILED = 'SAVE_DRAFT_FAILED'
const CHANGE_UNSAVED = 'CHANGE_UNSAVED'

const SaveDraftInitialState = 'InitialState'
const SavingState = 'Saving'
const ChangeUnsavedState = 'ChangeUnsaved'
const SaveSuccessState = 'SaveSuccess'
const SaveFailedState = 'SaveFailed'

function draftUnsaved () {
  return {
    type: CHANGE_UNSAVED
  }
}
function saveDraft (postData, callback) {
  return {
    types: [
      SAVING_DRAFT,
      SAVE_DRAFT_SUCCESS,
      SAVE_DRAFT_FAILED
    ],
    url: `${config.SERVER_URL}/draft`,
    options: postCommonOptions(postData),
    callback
  }
}

function draftSaveState (state = SaveDraftInitialState, action) {
  switch(action.type) {
    case SAVING_DRAFT:
      return SavingState
    case CHANGE_UNSAVED:
      return ChangeUnsavedState
    case SAVE_DRAFT_SUCCESS:
      return SaveSuccessState
    case SAVE_DRAFT_FAILED:
      return SaveFailedState
    default:
      return state
  }
}

const publishPostInitialState = {}
const PUBLISH_POST_SUCCESS = 'PUBLISH_POST_SUCCESS'
const PUBLISH_POST_FAILED = 'PUBLISH_POST_FAILED'
function publishPost (post, callback) {
  return {
    types: [
      null,
      PUBLISH_POST_SUCCESS,
      PUBLISH_POST_FAILED
    ],
    url: `${config.SERVER_URL}/post`,
    options: postCommonOptions(post),
    callback
  }
}
// function publishPost (post) {
//   let url = `${config.SERVER_URL}/post`
//   console.log(post)
//   return dispatch => {
//     fetch(
//       url,
//       postCommonOptions(post)
//     ).then(response => response.json())
//     .then(response => {
//       if (response.code === 0) {
//         dispatch({
//           type: PUBLISH_POST_SUCCESS,
//           payload: response.data
//         })
//       } else {
//         throw new Error(response.message || `POST ${url} Failed!`)
//       }
//     }).catch(error => {
//       dispatch({
//         type: PUBLISH_POST_FAILED,
//         payload: error
//       })
//     })
//   }
// }

const publishPostState = createPlainFetchReducer(
  publishPostInitialState,
  'PUBLISH_POST'
)

export const draftSaveAllStates = {
  SaveDraftInitialState,
  SavingState,
  ChangeUnsavedState,
  SaveSuccessState,
  SaveFailedState
}
export const saveDraftActions = {
  draftUnsaved,
  saveDraft
}
export const publishPostActions = {
  publishPost
}
export const postTagsActions = {
  getAllTags
}
export default combineReducers({
  draftSaveState,
  getAllTagsState
})
