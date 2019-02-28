import React, { Component } from 'react'
import Loadable from 'react-loadable'
import Loading from '../../common/components/Loading'

import styles from '../../resources/blog/scss/tags.scss'
import {loadComponentStyle} from '../../common/utils'

import TagPrefixes from '../components/TagPrefixes'

import config from '../../../common/config'

import {
  getAllTags,
  getPostsByTagId
} from '../../api/tags'

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

export default class Tags extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeCategory: 'All',
      showTags: [],
      activeTagId: -1,
      pagePosts: []
    }
    this.itemsPerPage = 5
    this.tagCountInCates = [...Array(28)].fill(0)
    this.notifyCategoryChange = this.notifyCategoryChange.bind(this)
    this.handleTagClick = this.handleTagClick.bind(this)
    this.getPagePosts = this.getPagePosts.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }
  componentDidMount () {
    getAllTags().then(data => {
      let tags = data.allTags
      console.log(tags)
      this.allTags = tags
      this.tagCountInCates = config.tagPrefixes.map(cate => tags.filter(tag => tag.class === cate.label).length)
      this.tagCountInCates[0] = tags.length
      if (tags.length) {
        this.setState({
          showTags: tags
        })
      }
    })
    loadComponentStyle(styles)
  }
  notifyCategoryChange (newCate) {
    let showTags = this.allTags.filter(tag => tag.class === newCate)
    let activeTagId = showTags.length ? showTags[0]._id : -1
    if (newCate === 'All') {
      // 点击All类别
      this.setState({
        activeCategory: 'All',
        showTags: this.allTags,
        activeTagId: -1,
        pagePosts: []
      })
      this.paginator.updateTotalItems(0)
    } else {
      getPostsByTagId(activeTagId, 1, this.itemsPerPage).then(response => {
        this.setState({
          activeCategory: newCate,
          showTags,
          activeTagId,
          pagePosts: response.pageDataInTags
        })
        this.paginator.updateTotalItems(response.totalItemsInTags)
      })
    }
  }
  handleTagClick (e) {
    let {tagId, tagClass} = e.target.dataset
    let {activeCategory, activeTagId} = this.state
    if (Number(tagId) !== activeTagId) {
      let newState = {
        activeTagId: Number(tagId)
      }
      if (activeCategory === 'All') {
        // 点击All类别下面的某个标签
        let showTags = this.allTags.filter(tag => tag.class === tagClass)
        newState = Object.assign(newState, {
          activeCategory: tagClass,
          showTags
        })
      }
      getPostsByTagId(tagId, 1, this.itemsPerPage).then(response => {
        newState = Object.assign(newState, {
          pagePosts: response.pageDataInTags
        })
        this.paginator.updateTotalItems(response.totalItemsInTags)
        console.log(newState)
        this.setState(newState)
      })
    }
  }
  getPagePosts (newPage, itemsPerPage) {
    let {activeTagId} = this.state
    return getPostsByTagId(activeTagId, newPage, itemsPerPage)
  }
  handlePageChange (pagePosts) {
    this.setState({
      pagePosts
    })
  }
  render () {
    let {
      activeCategory,
      activeTagId,
      showTags,
      pagePosts
    } = this.state

    let ShowTags
    if (showTags.length) {
      ShowTags = showTags.map(tag => <li
        className={`tag${tag._id === activeTagId ? ' active' : ''}`}
        key={tag._id}
      >
        <a
          href="javascript:void(0);"
          data-tag-id={tag._id}
          data-tag-class={tag.class}
          onClick={this.handleTagClick}
        >{tag.name}</a>
      </li>)
    } else {
      ShowTags = <div className="no-tags">该类别下暂无标签</div>
    }
    let posts
    if (pagePosts.length) {
      posts = <div className="articles-wrapper">
        {
          pagePosts.map((post, index) => <ArticleItem
            key={index}
            article={post}
          />)
        }
      </div>
    }
    return (
      <main className="main-wrapper tags-main">
        <div>
          <TagPrefixes
            tagCount={this.tagCountInCates}
            activeCategory={activeCategory}
            notifyCategoryChange={this.notifyCategoryChange} />
          <div className="tags-count-wrapper">
            <i className="line"></i>
            <h2>{`${showTags.length} TAG${showTags.length === 1 ? '' : 'S'}`}</h2>
            <i className="line"></i>
          </div>
          <ul className="tags-wrapper">
            {ShowTags}
          </ul>
          {posts}
          <div className="paginator-wrapper">
            <Paginator
              ref={ele => this.paginator = ele}
              getPageData={this.getPagePosts}
              handlePageDataChange={this.handlePageChange}
            />
          </div>
        </div>
      </main>
    )
  }
}
