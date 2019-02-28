import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Loadable from 'react-loadable'

import {postsActions} from '../reducers/postsReducer'
import Loading from '../../common/components/Loading'

let EditPostPanel = Loadable({
  loader: () => import(
    /* webpackChunkName: "EditPostPanel" */
    '../components/EditPostPanel'
  ),
  loading: Loading
})

@connect(state => ({
  postContentLoadingState: state.classifiedPosts.postContentLoadingState
}), dispatch => bindActionCreators(postsActions, dispatch))
class ModifyPost extends Component {
  constructor (props) {
    super(props)
    this.init()
  }
  init () {
    let modifyPostId = this.props.match.params.id,
        post = this.props.postContentLoadingState
    if (!post._id || post._id !== Number(modifyPostId)) {
      this.props.loadPostContent(modifyPostId)
    }
  }
  render () {
    let loadingContent = this.props.postContentLoadingState,
        loading, postContent
    if (loadingContent.loading) {
      loading = <Loading />
    }
    if (
      Number(loadingContent._id) === Number(this.props.match.params.id)
    ) {
      // 注意EditPostPanel在获取props时获取的是id
      loadingContent = Object.assign({}, loadingContent, {
        id: Number(loadingContent._id)
      })
      postContent = <EditPostPanel {...loadingContent} />
    }
    return (
      <div className="modify-post-wrapper">
        { loading }
        { postContent }
      </div>
    )
  }
}

export default ModifyPost
