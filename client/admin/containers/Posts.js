import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import { Route } from 'react-router'
import Loadable from 'react-loadable'

import styles from '../../resources/admin/scss/posts.scss'
import {loadComponentStyle} from '../../common/utils'

import {postsActions} from '../reducers/postsReducer'
import ModifyPost from './ModifyPost'
import Loading from '../../common/components/Loading'
import config from '../../config'
import {ajax, transformMarkdown} from '../../../common/utils'

let Dialog = Loadable({
  loader: () => import(
    /* webpackChunkName: "Dialog" */
    '../../common/components/Dialog'
  ),
  loading: Loading
})

@connect(state => ({
  classifiedPostsLoadingState: state.classifiedPosts.loadingState,
  postContentLoadingState: state.classifiedPosts.postContentLoadingState
}), dispatch => bindActionCreators(postsActions, dispatch))
class Posts extends Component {
  constructor (props) {
    super(props)
    this.toggleCategoryOpen = this.toggleCategoryOpen.bind(this)
    this.revokePost = this.removeOrRecoverPost({
      method: 'DELETE',
      url: `${config.SERVER_URL}/post`,
      inquireText: '你确定要撤销已经发布过的文章吗？',
      successText: '文章撤销成功！'
    }).bind(this)
    this.fakeRemovePost = this.removeOrRecoverPost({
      method: 'DELETE',
      url: `${config.SERVER_URL}/draft`,
      inquireText: '你确定要把这篇草稿放入回收站吗？',
      successText: '已将草稿放入回收站中！'
    }).bind(this)
    this.removePost = this.removeOrRecoverPost({
      method: 'DELETE',
      url: `${config.SERVER_URL}/draft`,
      inquireText: '你确定要彻底删除这篇文章吗？',
      successText: '文章已经彻底删除！'
    }).bind(this)
    this.recoverPost = this.removeOrRecoverPost({
      method: 'PUT',
      url: `${config.SERVER_URL}/post`,
      inquireText: '你确定要恢复该文章吗？',
      successText: '文章恢复成功！'
    }).bind(this)
    this.loadPostContent = this.loadPostContent.bind(this)
    console.log('Posts Construct')
    this.state = {
      onDialogConfirm () {},
      dialogConfig: {
        title: '操作提示',
        text: '',
        noBorder: true
      }
    }
  }
  componentDidMount () {
    this.init()
    loadComponentStyle(styles)
    import(
      /* webpackChunkName: "highlight" */
      'highlight.js').then(hljs => {
      this.hljs = hljs
    })
    import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ).then($ => this.$ = $)
  }
  init () {
    if (!this.props.classifiedPostsLoadingState.drafts) {
      this.props.loadClassifiedPosts()
    }
  }
  toggleCategoryOpen (e) {
    console.log(e.currentTarget)
    this.$(e.currentTarget.parentNode).toggleClass('open').siblings().removeClass('open')
  }
  loadPostContent (e) {
    // 只获取到文章_id和content信息
    this.props.loadPostContent(e.currentTarget.getAttribute('data-post-id'))
  }
  showModifyPost (e) {
    e.stopPropagation()
  }
  removeOrRecoverPost (params) {
    return e => {
      let id = e.target.getAttribute('data-post-id'),
          onDialogConfirm = (() => {
            ajax(params.method, params.url, {
              id
            }).then(data => {
              this.toggleDialog()
              this.props.loadClassifiedPosts()
              setTimeout(() => {
                alert(params.successText)
              }, 500)
            }).catch(err => {
              console.log(err)
            })
          }).bind(this)
      this.setState(Object.assign({}, this.state, {
        onDialogConfirm,
        dialogConfig: {
          ...this.state.dialogConfig,
          text: params.inquireText
        }
      }))
      this.toggleDialog()
      e.stopPropagation()
    }
  }
  toggleDialog () {
    this.dialog.toggleDialog()
  }
  render () {
    let draftsRender, publishedRender, independentPagesRender, recycleDraftsRender,
        loadingPosts = this.props.classifiedPostsLoadingState
    let postContent, postContentLoading,
        loadingPost = this.props.postContentLoadingState
    console.log(loadingPosts)
    if (loadingPosts.loading) {
      draftsRender = publishedRender = independentPagesRender = <div className="loading-wrapper">
        <Loading />
      </div>
    } else {
      // <time>15:24 on Jan 24, 2018</time>
      if (loadingPosts.drafts) {
        draftsRender = <ul className="category-posts-list">{
          loadingPosts.drafts.map(post => (
            <li
              key={post._id}
              data-post-id={post._id}
              onClick={this.loadPostContent}
              className={loadingPost._id === post._id ? 'selected-post' : ''}
            >
              <h3>
                {post.title || '无标题'}
                <i
                  className="icon delete-post-icon"
                  data-post-id={post._id}
                  onClick={this.fakeRemovePost}
                ></i>
              </h3>
              <div className="modify-time-wrapper">
                <p className="post-modify-time">
                  Last Modified @ <time>{post.lastModifiedAt}</time>
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  onClick={this.showModifyPost}
                  className="admin-icon admin-edit-icon"
                ></Link>
              </div>
            </li>
          ))
        }</ul>
        publishedRender = <ul className="category-posts-list">{
          loadingPosts.publishedPosts.map(post => (
            <li
              key={post._id}
              data-post-id={post._id}
              onClick={this.loadPostContent}
              className={loadingPost._id === post._id ? 'selected-post' : ''}
            >
              <h3>
                {post.title || '无标题'}
                <i
                  className="icon revoke-icon"
                  data-post-id={post._id}
                  onClick={this.revokePost}
                ></i>
              </h3>
              <div className="modify-time-wrapper">
                <p className="post-modify-time">
                  Last Modified @ <time>{post.lastModifiedAt}</time>
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  onClick={this.showModifyPost}
                  className="admin-icon admin-edit-icon"
                ></Link>
              </div>
            </li>
          ))
        }</ul>
        independentPagesRender = <ul className="category-posts-list">{
          loadingPosts.independentPages.map(post => (
            <li
              key={post._id}
              data-post-id={post._id}
              onClick={this.loadPostContent}
              className={loadingPost._id === post._id ? 'selected-post' : ''}
            >
              <h3>
                {post.title || '无标题'}
                <i
                  className="icon revoke-icon"
                  data-post-id={post._id}
                  onClick={this.revokePost}
                ></i>
              </h3>
              <div className="modify-time-wrapper">
                <p className="post-modify-time">
                  Last Modified @ <time>{post.lastModifiedAt}</time>
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  onClick={this.showModifyPost}
                  className="admin-icon admin-edit-icon"
                ></Link>
              </div>
            </li>
          ))
        }</ul>
        recycleDraftsRender = <ul className="category-posts-list">{
          loadingPosts.recycledDrafts.map(post => (
            <li
              key={post._id}
              data-post-id={post._id}
              onClick={this.loadPostContent}
              className={loadingPost._id === post._id ? 'selected-post' : ''}
            >
              <h3>
                {post.title || '无标题'}
                <i
                  className="icon delete-post-icon"
                  data-post-id={post._id}
                  onClick={this.removePost}
                ></i>
                <i
                  className="icon recover-post-icon"
                  data-post-id={post._id}
                  onClick={this.recoverPost}
                ></i>
              </h3>
              <div className="modify-time-wrapper">
                <p className="post-modify-time">
                  Last Modified @ <time>{post.lastModifiedAt}</time>
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  onClick={this.showModifyPost}
                  className="admin-icon admin-edit-icon"
                ></Link>
              </div>
            </li>
          ))
        }</ul>
      }
    }

    if (loadingPost.loading) {
      postContentLoading = <Loading className='post-content-loading' />
    } else {
      if (loadingPost.content) {
        postContent = transformMarkdown(loadingPost.content, true)
        this.articlePreview.innerHTML = postContent
        this.$('pre code').each((i, block) => {
          this.hljs.highlightBlock(block)
        })
      }
    }
    return (
      <main className="admin-main admin-posts-main">
        <Dialog
          ref={ele => this.dialog = ele}
          dialog={this.state.dialogConfig}
          dialogConfirm={this.state.onDialogConfirm}
        >
          {this.state.dialogConfig.text}
        </Dialog>
        <div className="posts-categories">
          <div className="posts-category open">
            <a
              href="javascript:void(0);"
              onClick={this.toggleCategoryOpen}
              className="category-title-wrapper"
            >
              <div className="category-title">
                <i className="post-page-icon admin-publish-icon"></i>
                <h2>已发布</h2>
              </div>
              <i className="post-page-icon admin-up-icon"></i>
            </a>
            {publishedRender}
          </div>
          <div className="posts-category">
            <a
              href="javascript:void(0);"
              onClick={this.toggleCategoryOpen}
              className="category-title-wrapper"
            >
              <div className="category-title">
                <i className="post-page-icon admin-draft-icon"></i>
                <h2>草稿箱</h2>
              </div>
              <i className="post-page-icon admin-up-icon"></i>
            </a>
            {draftsRender}
          </div>
          <div className="posts-category">
            <a
              href="javascript:void(0);"
              onClick={this.toggleCategoryOpen}
              className="category-title-wrapper"
            >
              <div className="category-title">
                <i className="post-page-icon admin-independent-page-icon"></i>
                <h2>独立页面</h2>
              </div>
              <i className="post-page-icon admin-up-icon"></i>
            </a>
            {independentPagesRender}
          </div>
          <div className="posts-category">
            <a
              href="javascript:void(0);"
              onClick={this.toggleCategoryOpen}
              className="category-title-wrapper"
            >
              <div className="category-title">
                <i className="post-page-icon admin-recycle-icon"></i>
                <h2>回收站</h2>
              </div>
              <i className="post-page-icon admin-up-icon"></i>
            </a>
            {recycleDraftsRender}
          </div>
        </div>
        <div className="post-detail-wrapper">
          {postContentLoading}
          <article className="article-detail-wrapper">
            <main ref={ ele => this.articlePreview = ele }>
            </main>
          </article>
        </div>
        <Route path="/posts/:id" component={ModifyPost} />
      </main>
    )
  }
}

export default Posts
