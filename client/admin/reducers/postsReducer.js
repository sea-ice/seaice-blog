import {combineReducers} from 'redux'

import config from '../../config'
import {createLoadingReducer} from '../../common/utils/components'

const postsLoadingStateInitialState = {}
const LOADING_CLASSIFIED_POSTS = 'LOADING_CLASSIFIED_POSTS'
const LOADING_CLASSIFIED_POSTS_SUCCESS = 'LOADING_CLASSIFIED_POSTS_SUCCESS'
const LOADING_CLASSIFIED_POSTS_FAILED = 'LOADING_CLASSIFIED_POSTS_FAILED'
function loadClassifiedPosts () {
  return {
    types: [
      LOADING_CLASSIFIED_POSTS,
      LOADING_CLASSIFIED_POSTS_SUCCESS,
      LOADING_CLASSIFIED_POSTS_FAILED
    ],
    url: `${config.SERVER_URL}/posts`
  }
}

let loadingState = createLoadingReducer(
  postsLoadingStateInitialState,
  LOADING_CLASSIFIED_POSTS
)

const postContentLoadingInitialState = {}
const LOADING_POST_CONTENT = 'LOADING_POST_CONTENT'
const LOADING_POST_CONTENT_SUCCESS = 'LOADING_POST_CONTENT_SUCCESS'
const LOADING_POST_CONTENT_FAILED = 'LOADING_POST_CONTENT_FAILED'
function loadPostContent (postId) {
  let url = `${config.SERVER_URL}/post?id=${postId}`
  return {
    types: [
      LOADING_POST_CONTENT,
      LOADING_POST_CONTENT_SUCCESS,
      LOADING_POST_CONTENT_FAILED
    ],
    url
  }
}

let postContentLoadingState = createLoadingReducer(
  postContentLoadingInitialState,
  LOADING_POST_CONTENT
)

export const postsActions = {
  loadClassifiedPosts,
  loadPostContent
}

export default combineReducers({
  loadingState,
  postContentLoadingState
})
