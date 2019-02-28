import React, { Component } from 'react'
import { connect } from 'react-redux'

import Loadable from 'react-loadable'
import Loading from '../../common/components/Loading'

// import Aside from '../components/Aside'
// import Article from '../components/Article'
// import ArticleItem from '../components/ArticleItem'
import {getPostDetail} from '../../api/posts'

let Aside = Loadable({
  loader: () => import(
    /* webpackChunkName: "Aside" */
    '../components/Aside'
  ),
  loading: Loading
})

let Article = Loadable({
  loader: () => import(
    /* webpackChunkName: "Article" */
    '../components/Article'
  ),
  loading: Loading
})

let ArticleItem = Loadable({
  loader: () => import(
    /* webpackChunkName: "ArticleItem" */
    '../components/ArticleItem'
  ),
  loading: Loading
})

class IPageTemplate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      article: null,
      view: 'normal',
      searchError: null,
      searchResult: []
    }
    this.initializePostDetail()
    this.changeView = this.changeView.bind(this)
  }
  componentDidMount () {
    console.log('independent page mounted')
  }
  initializePostDetail () {
    let { postId } = this.props
    console.log(postId)
    if (postId) {
      getPostDetail(postId).then(response => {
        console.log(response.data)
        this.setState(Object.assign({}, this.state, {
          article: response.data.post
        }))
      })
    }
  }
  changeView (view, data) {
    this.setState({
      view,
      ...data
    })
  }
  render () {
    let {article, view, searchError, searchResult} = this.state
    let articleDetail
    if (article) {
      articleDetail = <Article article={article} noTags={true} />
    }

    if (searchError) {
      searchResult = <p className="error-text">{searchError}</p>
    } else {
      let posts = searchResult.map(item => <ArticleItem
        key={item._id}
        article={item}
      />)
      searchResult = <div className="search-result">
        <p className="search-result-title">为您找到以下文章：</p>
        <div className="posts-wrapper">{posts}</div>
      </div>
    }
    return (
      <div className="main-wrapper">
        <main className="app-main">
          <div className={`normal-view${view === 'normal' ? ' show' : ''}`}>
            {articleDetail}
          </div>
          <div className={`search-view${view === 'search' ? ' show' : ''}`}>
            {searchResult}
          </div>
        </main>
        <Aside changeView={this.changeView} />
      </div>
    )
  }
}

export default connect(state => ({}), dispatch => ({}))(IPageTemplate)
