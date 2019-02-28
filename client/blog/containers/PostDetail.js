import React, { Component } from 'react'
import Loadable from 'react-loadable'
import Loading from '../../common/components/Loading'

import styles from '../../resources/blog/scss/postContents.scss'
import {loadComponentStyle} from '../../common/utils'

// import Article from '../components/Article'
import { getPostDetail } from '../../api/posts'
import { elementPageTop, getRootFontSize } from '../../resources/blog/js/utils'

let Article = Loadable({
  loader: () => import(
    /* webpackChunkName: "Article" */
    '../components/Article'
  ),
  loading: Loading
})

class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      article: null
    }
    this.handleScrollIndicatorTE = this.handleScrollIndicatorTE.bind(this)
  }
  componentDidMount () {
    loadComponentStyle(styles)
    import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ).then($ => {
      this.$ = $
      this.initializePostDetail()
    })
  }
  initializePostDetail () {
    let { match } = this.props
    let id = match.params.id
    if (id) {
      getPostDetail(id).then(response => {
        console.log(response.data)
        this.setState({
          article: response.data.post
        }, () => {
          // 文章详情渲染完成之后初始化文章目录
          // 初始化文章目录
          console.log('generate contents')
          setTimeout(() => {
            this.contentsWrapper.innerHTML = this.generateContents()
            console.log(this.generateContents())
            this.$contentsItems = this.$('.post-contents .post-contents-item')
            this.initContentsActiveItem()

            // 给目录项绑定点击事件
            this.contentsWrapper.addEventListener('click', e => {
              window.scrollTo({
                top: this.titleOffsetTops[e.target.dataset.titleIndex],
                behavior: 'smooth'
              })
            }, false)
          }, 200)

          window.addEventListener('resize', e => {
            this.initContentsActiveItem()
          })
          window.addEventListener('scroll', e => {
            // 获取body元素内容滚动过的垂直距离
            let {url} = this.props.match
            if (!location.hash.slice(1).match(new RegExp(url))) return
            let scrollIndex = this.getScrollIndex()
            if (this.scrollIndex !== scrollIndex) {
              this.scrollIndex = scrollIndex
              this.setContentsActiveItem()
            }
          })
        })
      })
    }
  }
  getScrollIndex () {
    let top = -(document.body.getBoundingClientRect().top)
    let scrollIndex
    if (top >= this.titleOffsetTops[0]) {
      for (let i = 0, len = this.titleOffsetTops.length; i < len; i++) {
        if (this.titleOffsetTops[i + 1]) {
          if (
            top >= this.titleOffsetTops[i] &&
            top < this.titleOffsetTops[i + 1]
          ) {
            scrollIndex = i
            break
          }
        } else {
          scrollIndex = i
        }
      }
    } else {
      scrollIndex = -1
    }
    return scrollIndex
  }
  setContentsActiveItem () {
    // 根据this.scrollIndex的值设置激活状态的目录项
    let $scrollIndicator = this.$(this.scrollIndicator)
    this.$contentsItems.removeClass('active')
    if (this.scrollIndex === -1) {
      $scrollIndicator.addClass('hide')
    } else {
      if ($scrollIndicator.hasClass('hide')) {
        $scrollIndicator.removeClass('hide')
        this.$(this.$contentsItems[this.scrollIndex]).addClass('active')
      }
      this.scrollIndicator.style.transform = `translateY(${
        this.contentsItemHeight * this.scrollIndex
      }px)`
    }
  }
  initContentsActiveItem () {
    // 初始化选中的目录项
    let titles = this.$(this.postWrapper).find('.post-content').find('h2, h3, h4, h5, h6')
    this.titleOffsetTops = []
    this.$.each(titles, (i, t) => {
      this.titleOffsetTops.push(elementPageTop(t) - 20)
    })
    this.contentsItemHeight = 1.875 * getRootFontSize()
    this.scrollIndex = this.getScrollIndex()
    this.setContentsActiveItem()
  }
  generateContents () {
    let titles = this.$(this.postWrapper).find('.post-content').find('h2, h3, h4, h5, h6'),
      titleList = '<ul class="post-contents">', lastTitleType
    this.$.each(titles, (i, t) => {
      let end = Number(t.tagName.slice(1))
      if (lastTitleType) {
        if (lastTitleType !== t.tagName) {
          let start = Number(lastTitleType.slice(1))
          if (start < end) {
            titleList += `<li><ul>`
          } else {
            while (start-- !== end) {
              titleList += `</ul></li>`
            }
          }
          lastTitleType = t.tagName
        }
      } else {
        lastTitleType = t.tagName
      }
      titleList += `<li class="post-contents-item"><a href="javascript:void(0);" class="contents-item-level-${end}" data-title-index=${i}>${t.innerText}</a></li>`
      if (i === titles.length - 1) {
        while (end-- !== 2) {
          titleList += `</ul></li>`
        }
      }
    })
    titleList += '</ul>'
    return titleList
  }
  handleScrollIndicatorTE () {
    let $targetItem = this.$(this.$contentsItems[this.scrollIndex])
    $targetItem.addClass('active')
  }
  render () {
    let {article} = this.state
    let articleDetail
    if (article) {
      articleDetail = <Article article={article} />
    }
    return (
      <div className='main-wrapper'>
        <main
          className='app-main'
          ref={ele => this.postWrapper = ele}
        >
          {articleDetail}
        </main>
        <aside className='post-contents-container'>
          <h2 className='post-contents-title'>文章目录</h2>
          <div className="post-contents-main">
            <div
              className='post-contents-wrapper'
              ref={ele => this.contentsWrapper = ele}
            ></div>
            <span
              className="scroll-indicator hide"
              ref={ele => this.scrollIndicator = ele}
              onTransitionEnd={this.handleScrollIndicatorTE}
            ></span>
          </div>
        </aside>
      </div>
    )
  }
}

export default PostDetail
