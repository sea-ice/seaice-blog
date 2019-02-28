import React, { Component } from 'react'
import Loadable from 'react-loadable'
import Loading from '../../common/components/Loading'

import styles from '../../resources/blog/scss/archive.scss'
import {loadComponentStyle} from '../../common/utils'

import {getRootFontSize, elementPageTop} from '../../resources/blog/js/utils'

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

export default class Archive extends Component {
  constructor (props) {
    super(props)
    this.state = {
      archive: {},
      activeYear: '',
      activeMonth: '',
      activeDate: '',

      view: 'normal',
      searchError: null,
      searchResult: []
    }
    this.months = ['Jan', 'Febr', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    getPagePosts(1, 20).then(response => {
      if (response.pageDataInHome.length) {
        this.setState(this.handlePosts(response.pageDataInHome, true))
      }
    })
    this.changeView = this.changeView.bind(this)
  }
  componentDidMount () {
    loadComponentStyle(styles)
    import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ).then($ => this.$ = $)
  }
  componentDidUpdate () {
    let yearArticles = this.$('.year-article-wrapper')
    let dateNodes = this.$('.post-date-wrapper')
    let yearFixedNodes = this.$('.years-list a')

    let handlePageScroll = (e) => {
      let {url} = this.props.match
      // 由于添加了全局监听的scroll事件，所以需要判断当前路由是否匹配当前组件再执行后续逻辑
      if (!location.hash.slice(1).match(new RegExp(url))) return
      if (this.state.view === 'search') return
      // 根据页面滚动距离设置年份title的定位
      let rootFontSize = getRootFontSize()
      let mainClientTop = this.archiveMain.getBoundingClientRect().top
      let yearsListClientLeft = this.yearsListWrapper.getBoundingClientRect().left
      if (mainClientTop <= rootFontSize) {
        this.$(this.yearsListWrapper).addClass('fixed')
        this.yearsListWrapper.style.left = `${yearsListClientLeft}px`
      } else {
        this.$(this.yearsListWrapper).removeClass('fixed')
        this.yearsListWrapper.style.left = '0px'
      }
      // 设置年份title定位代码结束
      let nodeClientTopLimit = 4.6 * rootFontSize
      let currentIndex
      let $dateIndicator = this.$(this.dateIndicator)
      for (let i = 0, len = dateNodes.length; i < len; i++) {
        let nodeClientTop = dateNodes[i].getBoundingClientRect().top
        let itemHeight = this.$(dateNodes[i]).get(0).parentNode.parentNode.clientHeight
        if (nodeClientTop > -(itemHeight - 0.5 * nodeClientTopLimit) && nodeClientTop < 0.5 * nodeClientTopLimit) {
          let date = dateNodes[i].innerText.replace(/\s+/g, '-').replace(/-+$/, '')
          if (this.dateIndicator.getAttribute('data-current-date') !== date) {
            [this.currentMonth.innerHTML, this.currentDate.innerHTML] = date.split('-')
            this.dateIndicator.setAttribute('data-current-date', date)
          }
        }
        if (nodeClientTop > -(itemHeight - nodeClientTopLimit) && nodeClientTop < nodeClientTopLimit) {
          if (i === 0) {
            $dateIndicator.css('opacity', 1)
            this.$(dateNodes[i]).css('opacity', 1)
            if (nodeClientTop <= rootFontSize) {
              if (!$dateIndicator.hasClass('show')) {
                $dateIndicator.addClass('show')
              }
              if (!$dateIndicator.hasClass('mask')) {
                $dateIndicator.addClass('mask')
              }
            } else {
              if ($dateIndicator.hasClass('show')) {
                $dateIndicator.removeClass('show')
              }
            }
          } else {
            if (!$dateIndicator.hasClass('show')) {
              $dateIndicator.addClass('show')
            }
            if ($dateIndicator.hasClass('mask')) {
              $dateIndicator.removeClass('mask')
            }
            if (e) {
              if (nodeClientTop > 0 && nodeClientTop <= nodeClientTopLimit) {
                let dateNodeOpacity = Math.abs(nodeClientTop / nodeClientTopLimit)
                $dateIndicator.css('opacity', dateNodeOpacity < 0.5 ? 1 - dateNodeOpacity : dateNodeOpacity)
                if (nodeClientTop <= rootFontSize) {
                  this.$(dateNodes[i]).css('opacity', 0)
                } else {
                  this.$(dateNodes[i]).css('opacity', dateNodeOpacity * 4.6 / 3.6)
                }
              } else if (nodeClientTop <= 0 && nodeClientTop > -nodeClientTopLimit) {
                this.$(dateNodes[i]).css('opacity', 0)
                $dateIndicator.css('opacity', 1)
              } else if (nodeClientTop <= -nodeClientTopLimit) {
                this.$(dateNodes[i]).css('opacity', 1)
                $dateIndicator.css('opacity', 1)
              }
            } else {
              // 初始化时直接设置元素的透明度
              this.$(dateNodes[i]).css('opacity', 1)
              $dateIndicator.css('opacity', 1)
            }
          }
          currentIndex = i
          break
        }
      }
      // 修复页面向上滚动速度过快时时间节点透明度不为1的bug
      if (currentIndex !== undefined) {
        for (let i = currentIndex + 1, len = dateNodes.length; i < len; i++) {
          this.$(dateNodes[i]).css('opacity', 1)
        }
      }
      // 修复页面快速滚动到顶部时固定时间节点依然显示的bug
      setTimeout(() => {
        if (dateNodes[0].getBoundingClientRect().top > rootFontSize) {
          if ($dateIndicator.hasClass('show')) {
            $dateIndicator.removeClass('show')
          }
        }
      }, 0)

      let yearLinkHeight = 1.875 * rootFontSize
      for (let i = 0, len = yearArticles.length; i < len; i++) {
        let yearArticleClientTop = yearArticles[i].getBoundingClientRect().top
        let currentYearItemHeight = yearArticles[i].clientHeight
        if (yearArticleClientTop < rootFontSize && yearArticleClientTop >= -(currentYearItemHeight - rootFontSize)) {
          if (this.$(yearFixedNodes[i]).hasClass('active')) return
          this.$(yearFixedNodes[i].parentNode).addClass('active').siblings().removeClass('active')
          this.$(this.yearLinks).css('transform', `translateY(${-i * yearLinkHeight}px)`)
          if (i === 0) {
            this.$(this.yearsListWrapper).addClass('hide-up')
          } else {
            this.$(this.yearsListWrapper).removeClass('hide-up')
          }
        }
      }
      if (yearArticles[0].getBoundingClientRect().top > rootFontSize) {
        this.$(this.yearsListWrapper).addClass('hide-up')
      }
    }
    handlePageScroll()
    window.addEventListener('scroll', handlePageScroll)

    this.$(this.yearLinks).on('click', e => {
      let rootFontSize = getRootFontSize()
      let yearLinkHeight = 1.875 * rootFontSize

      if (this.$(e.target.parentNode).hasClass('active')) return
      this.$(e.target.parentNode).addClass('active').siblings().removeClass('active')
      let i = yearFixedNodes.index(this.$('.years-list .active a'))
      this.$(this.yearLinks).css('transform', `translateY(${-i * yearLinkHeight}px)`)
      if (i === 0) {
        this.$(this.yearsListWrapper).addClass('hide-up')
      } else {
        this.$(this.yearsListWrapper).removeClass('hide-up')
      }
      this.$(document.documentElement).animate({
        scrollTop: elementPageTop(yearArticles[i]) - 7.0625 * rootFontSize
      })
    })
    this.$(this.upIcon).on('click', e => {
      let rootFontSize = getRootFontSize()
      let yearLinkHeight = 1.875 * rootFontSize
      let translateY = Math.abs(this.yearLinks.style.transform.replace(/[^-\.\d]/g, ''))

      let i = Math.round(translateY / yearLinkHeight)
      this.$(this.yearLinks).css('transform', `translateY(${-(i-1) * yearLinkHeight}px)`)
      if (i === 1) {
        this.$(this.yearsListWrapper).addClass('hide-up')
      }
    })
  }
  handlePosts (posts, initial) {
    let {archive} = this.state
    let activeYear, activeMonth, activeDate
    if (!initial) {
      let years = Object.keys(archive)
      activeYear = Math.min(...years)
      let months = Object.keys(archive[activeYear])
      activeMonth = Math.min(...months)
      let postsInMonth = archive[activeYear][activeMonth]
      activeDate = postsInMonth[postsInMonth.length - 1].publishTime.date
    }
    for (let post of posts) {
      let {year, month} = post.publishTime
      if (!archive[year]) {
        archive[year] = {}
      }
      if (!archive[year][month]) {
        archive[year][month] = []
      }
      archive[year][month].push(post)
    }
    // 设置高亮的年份
    if (initial) {
      let years = Object.keys(archive)
      activeYear = Math.max(...years)
      let months = Object.keys(archive[activeYear])
      activeMonth = Math.max(...months)
      activeDate = archive[activeYear][activeMonth][0].publishTime.date
    }
    console.log([activeYear, activeMonth, activeDate])
    return {
      archive: Object.assign({}, archive),
      activeYear,
      activeMonth: this.months[activeMonth - 1],
      activeDate
    }
  }
  changeView (view, data) {
    this.setState({
      view,
      ...data
    })
  }
  render () {
    let {
      archive,
      activeYear,
      activeMonth,
      activeDate,
      view,
      searchError,
      searchResult
    } = this.state
    let years = Object.keys(archive)

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
        <main className="app-main archive-main" ref={ele => this.archiveMain = ele}>
          <div className={`normal-view${view === 'normal' ? ' show' : ''}`}>
            <div
              className="years-list-container"
              ref={ele => this.yearsListWrapper = ele}
            >
              <i className="up-icon" ref={ele => this.upIcon = ele}></i>
              <div className="years-list-wrapper">
                <ul className="years-list" ref={ele => this.yearLinks = ele}>
                  {years.map(year => (
                    <li
                      key={`year-${year}`}
                      className={year === activeYear ? 'active' : ''}
                    >
                      <a href="javascript:void(0);">{year}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <section className="timeline-content">
              <div className="current-date-indicator" ref={ele => this.dateIndicator = ele}>
                <p className="month" ref={ele => this.currentMonth = ele}>{activeMonth}</p>
                <p className="date" ref={ele => this.currentDate = ele}>{activeDate}</p>
              </div>
              <ul>
                {years.map(year => (
                  <li
                    className="year-article-wrapper"
                    key={`year-${year}`}
                    id={`year-${year}`}
                  >
                    {Object.keys(archive[year]).map(month => (
                      <ul
                        className="month-article-list"
                        key={`month-${year}-${month}`}
                      >
                        {archive[year][month].map(post => {
                          let {date, hour, minute} = post.publishTime
                          return (
                            <li key={`post-${year}-${month}-${date}-${hour}-${minute}`}>
                              <div className="archive-article-item">
                                <div className="timeline">
                                  <div className="post-date-wrapper">
                                    <p className="month">{this.months[month - 1]}</p>
                                    <p className="date">{date}</p>
                                  </div>
                                  <div className="timeline-node"></div>
                                  <p className="post-time">{hour}:{minute}</p>
                                </div>
                                <ArticleItem notShowTime={true} article={post} />
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    ))}
                  </li>
                ))}
              </ul>
            </section>
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
