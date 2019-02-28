import React, { Component } from 'react'
import { connect } from 'react-redux'

import Loadable from 'react-loadable'
import Loading from '../../common/components/Loading'

// import ArticleItem from '../components/ArticleItem'
// import Aside from '../components/Aside'
// import Paginator from '../components/Paginator'
import {getPagePosts} from '../../api/posts'

let Aside = Loadable({
  loader: () => import(
    /* webpackChunkName: "Aside" */
    '../components/Aside'
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

let Paginator = Loadable({
  loader: () => import(
    /* webpackChunkName: "Paginator" */
    '../components/Paginator'
  ),
  loading: Loading
})

class Home extends Component {
  constructor (props) {
    super(props)
    this.handlePageDataChange = this.handlePageDataChange.bind(this)
    this.changeView = this.changeView.bind(this)
    this.state = {
      pagePosts: [],
      view: 'normal',
      searchError: null,
      searchResult: []
    }
    // console.log(initGeetest)
  }
  handlePageDataChange (pageData) {
    this.setState(Object.assign({}, this.state, {
      pagePosts: pageData
    }))
  }
  changeView (view, data) {
    this.setState({
      view,
      ...data
    })
  }
  render () {
    let {pagePosts, view, searchError, searchResult} = this.state, articles
    if (pagePosts.length) {
      articles = pagePosts.map(
        post => <ArticleItem
          key={post._id}
          article={post}
        />
      )
    } else {
      articles = <div className="no-page-data"></div>
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
            <div className="home-articles">
              {articles}
            </div>
            <div className="paginator-wrapper">
              <Paginator
                getPageData={getPagePosts}
                handlePageDataChange={this.handlePageDataChange}
              />
            </div>
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

export default connect(state => ({}), dispatch => ({}))(Home)
