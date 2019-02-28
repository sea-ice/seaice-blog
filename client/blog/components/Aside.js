import React, { Component } from 'react'
import {getSearchResult} from '../../api/search'
import {getHotArticles} from '../../api/posts'

import {loadComponentStyle} from '../../common/utils'
import styles from '../../resources/blog/scss/aside.scss'

export default class Aside extends Component {
  constructor (props) {
    super(props)
    this.handleSearchInputFocus = this.handleSearchInputFocus.bind(this)
    this.handleSearchClose = this.handleSearchClose.bind(this)
    this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this)
    this.handleSearchClick = this.handleSearchClick.bind(this)
    this.state = {
      showCloseIcon: false,
      hotArticles: []
    }
  }

  componentDidMount () {
    this.getHotArticles()
    loadComponentStyle(styles)
  }

  handleSearchInputFocus (e) {
    let {showCloseIcon} = this.state
    if (!showCloseIcon) {
      this.setState({
        showCloseIcon: true
      })
    }
  }
  handleSearchKeyDown (e) {
    if (e.keyCode === 13) {
      console.log('enter')
      this.getSearchResult()
    }
  }
  handleSearchClick () {
    this.getSearchResult()
  }
  handleSearchClose () {
    this.setState({
      showCloseIcon: false
    })
    this.props.changeView('normal', {
      searchError: null,
      searchResult: []
    })
    this.searchQuery.value = ''
  }
  getSearchResult () {
    let query = this.searchQuery.value.trim()
    if (query) {
      getSearchResult(query).then(response => {
        console.log(response)
        if (response.code === 0) {
          this.props.changeView('search', {
            searchError: null,
            searchResult: response.data
          })
        } else {
          this.props.changeView('search', {
            searchError: response.message,
            searchResult: null
          })
        }
      }).catch(err => {
        this.props.changeView('search', {
          searchError: '网络错误，请稍后再试',
          searchResult: null
        })
      })
    }
  }

  getHotArticles () {
    getHotArticles().then(data => {
      // console.log(data)
      this.setState({
        hotArticles: data.hotArticles
      })
    })
  }

  render () {
    let {showCloseIcon, hotArticles} = this.state

    if (hotArticles.length) {
      hotArticles = hotArticles.map(item => (<tr key={item._id}>
        <td>
          <a href="javascript:void(0);">
            <p className="hot-article-title">{item.title}</p>
          </a>
        </td>
        <td><span className="visit-count">{item.visitCount}</span></td>
      </tr>))
      hotArticles = <div className="app-aside-part">
        <h2>Hot Articles</h2>
        <table id="hot-articles-table" className="hot-articles-part">
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>文章</th>
              <th>浏览量</th>
            </tr>
          </thead>
          <tbody>
            {hotArticles}
          </tbody>
        </table>
      </div>
    } else {
      hotArticles = null
    }

    return (
      <aside className="app-aside" ref={ ele => {this.asideEle = ele} }>
        <div className={`search-input-wrapper${showCloseIcon ? ' show-close-button' : ''}`}>
          <input
            type="text"
            onFocus={this.handleSearchInputFocus}
            onBlur={this.handleSearchInputBlur}
            onKeyDown={this.handleSearchKeyDown}
            ref={ele => this.searchQuery = ele}
           />
          <a href="javascript:void(0);"
            className="button search-button"
            onClick={this.handleSearchClick}
          >
            <i></i>
          </a>
          <a href="javascript:void(0);"
            className="button close-button"
            onClick={this.handleSearchClose}
          >
            <i></i>
          </a>
        </div>
        <div className="app-aside-part">
          <h2>Colorful Life</h2>
          <main className="app-aside-content life-part">
            <a href="https://github.com/sea-ice" className="github-button">
              <i className="github-icon"></i>
              <p className="github-button-text">My Coding Life</p>
            </a>
          </main>
        </div>
        <div className="app-aside-part">
          <h2>My Attention</h2>
          <ul className="app-aside-content attention-part">
            <li>
              <a href="http://www.alloyteam.com/webdevelop/">腾讯全端团队--AlloyTeam</a>
            </li>
            <li><a href="https://www.75team.com/post/list">360前端团队--奇舞团</a></li>
            <li><a href="http://www.ruanyifeng.com/blog/">阮一峰老师的网络日志</a></li>
            <li><a href="https://aotu.io/index.html">凹凸实验室</a></li>
            <li><a href="http://taobaofed.org/categories/Web%E5%BC%80%E5%8F%91/">淘宝前端团队</a></li>
          </ul>
        </div>
        <div className="app-aside-part">
          <h2>Friend Links</h2>
          <ul className="app-aside-content friends-part">
            <li>
              <a href="http://www.alloyteam.com/webdevelop/">腾讯全端团队--AlloyTeam</a>
            </li>
            <li><a href="https://www.75team.com/post/list">360前端团队--奇舞团</a></li>
            <li><a href="http://www.ruanyifeng.com/blog/">阮一峰老师的网络日志</a></li>
            <li><a href="https://aotu.io/index.html">凹凸实验室</a></li>
            <li><a href="http://taobaofed.org/categories/Web%E5%BC%80%E5%8F%91/">淘宝前端团队</a></li>
          </ul>
        </div>
        {hotArticles}
      </aside>
    )
  }
}
