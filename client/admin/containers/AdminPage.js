import React, { Component } from 'react'
import Loadable from 'react-loadable'
import Loading from '../../common/components/Loading'

import { ADD_POST_STORAGE_KEY, lStorageGetAndSet, lStorageRemove } from '../../common/utils/storage'

let EditPostPanel = Loadable({
  loader: () => import(
    /* webpackChunkName: "EditPostPanel" */
    '../components/EditPostPanel'
  ),
  loading: Loading
})

class AdminPage extends Component {
  constructor (props) {
    super(props)
    this.init()
  }
  init() {
    let postStorage = JSON.parse(lStorageGetAndSet(ADD_POST_STORAGE_KEY))
    this.postData = postStorage || {
      title: '',
      content: '',
      tags: [],
      location: {
        province: '',
        city: ''
      },
      isIndependentPage: false
    }
    this.postData.isDraft = true
  }
  hookOnSaveDraftSuccess (savedPost) {
    lStorageGetAndSet(ADD_POST_STORAGE_KEY, JSON.stringify(savedPost))
  }
  hookOnPublishSuccess () {
    lStorageRemove(ADD_POST_STORAGE_KEY)
  }
  render () {
    return (
      <main className="admin-main add-post-page">
        <EditPostPanel
          createNewPost={true}
          {...this.postData}
          hookOnSaveDraftSuccess={this.hookOnSaveDraftSuccess}
          hookOnPublishSuccess={this.hookOnPublishSuccess}
        />
      </main>
    )
  }
}

export default AdminPage
