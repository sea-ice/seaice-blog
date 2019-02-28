import React, { Component } from 'react'
import Loadable from 'react-loadable'
import Loading from '../../common/components/Loading'

import styles from '../../resources/common/scss/article.scss'
import {loadComponentStyle} from '../../common/utils'

import CommentItem from '../components/CommentItem'
import {sortCommentItems} from '../../common/utils'
import {transformMarkdown, formatDate} from '../../../common/utils'
import { elementPageTop } from '../../resources/blog/js/utils'

let CommentBox = Loadable({
  loader: () => import(
    /* webpackChunkName: "CommentBox" */
    './CommentBox'
  ),
  loading: Loading
})

export default class Article extends Component {
  constructor (props) {
    super(props)
    this.handleUserComment = this.handleUserComment.bind(this)
    this.state = {
      article: props.article
    }
  }
  componentDidMount () {
    let {article} = this.props
    this.postMain.innerHTML = transformMarkdown(article.content)
    Promise.all([import(
      /* webpackChunkName: "highlight" */
      'highlight.js'
    ), import(
      /* webpackChunkName: "jquery" */
      'jquery'
    )]).then(res => {
      let [hljs, $] = res
      this.$ = $
      $('pre code').each((i, block) => {
        hljs.highlightBlock(block)
      })
    })
    // 加载组件所需的样式
    loadComponentStyle(styles)
  }
  initializeComments (comments) {
    let rootComments = comments.filter(c => c.replyTo === -1)
    let replies = comments.filter(c => c.replyTo !== -1)
    if (rootComments.length) {
      let targetComments = rootComments.slice(),
          count = 0
      while (count !== replies.length) {
        let nextTargetComments = []
        for (let i = 0, len = targetComments.length; i < len; i++) {
          let temp = replies.filter(c => c.replyTo === targetComments[i]._id)
          if (temp.length) {
            let replyToUser = targetComments[i].publisher.nickname
            temp.forEach(c => c.replyToUser = replyToUser)
            targetComments[i].replies = temp
            nextTargetComments = nextTargetComments.concat(temp)
            count += temp.length
          }
        }
        targetComments = nextTargetComments
      }
      // console.log(rootComments)
      return sortCommentItems(rootComments).map(
        (c, i) =>
        <CommentItem number={i + 1} comment={c}
          key={`comment-floor-${i + 1}`} />
      )
    } else {
      return <p className="no-comments">
        暂无评论 <i className="no-comments-icon"></i>
      </p>
    }
  }
  showCommentBox () {
    let $commentBox = this.$('#comment-box-reply-to-0')
    window.scrollTo({
      top: elementPageTop($commentBox[0]) - 20,
      behavior: 'smooth'
    })
    setTimeout(() => {
      $commentBox.find('textarea').focus()
    }, 500)
  }
  handleUserComment (newComment) {
    let {article} = this.state
    let {comments} = article
    comments.push(newComment)
    this.setState({
      article: {
        ...article,
        comments
      }
    })
  }
  render () {
    let {article} = this.state
    let publishTime = <time>{formatDate(article.publishTime, 'zh-cn')}</time>
    let lastModifiedAt = <time>{formatDate(article.lastModifiedAt, 'zh-cn')}</time>
    let comments = this.initializeComments(article.comments)
    let commentCount = comments.length || 0

    let tags = this.props.noTags ? null : <p
      className="article-tags-wrapper">
      <i className="article-icons tag-icon"></i>&nbsp;
      <span>{article.tags.map(tag => tag.name).join('， ')}</span>
    </p>
    return (
      <article className="article-detail-wrapper">
        <header>
          <h1>{article.title}</h1>
          <div className="article-meta">
            {tags}
            <p className="views-count-wrapper">
              <i className="article-icons view-icon"></i>&nbsp;
              <span>{`${article.visitCount} view${article.visitCount === 1 ? '' : 's'}`}</span>
            </p>
          </div>
        </header>
        <main
          className="post-content"
          ref={ele => this.postMain = ele}
        ></main>
        <footer>
          <p className="article-end">（&nbsp;完&nbsp;）</p>
          <div className="article-meta-wrapper">
            <i className="avatar"></i>
            <p>
              Jack&nbsp;发表于&nbsp;
              {publishTime}
              &nbsp;&nbsp;
              坐标：<span className="location">Xi'An</span>
            </p>
            <p>
              最后一次修改于&nbsp;
              {lastModifiedAt}
              &nbsp;&nbsp;
              坐标：<span className="location">Xi'An</span>
            </p>
          </div>
          <div className="comment-wrapper">
            <header className="comment-title-wrapper">
              <h2 className="comment-title"><i></i> {commentCount} {`Comment${commentCount === 1 ? '' : 's' }`}</h2>
              <a href="javascript:void(0);" onClick={this.showCommentBox}>
                <p>我要留言</p>
                <i>
                  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M87.3472 510.702933c0 235.690667 191.0272 426.683733 426.666667 426.683733s426.666667-190.993067 426.666667-426.683733c0-235.639467-191.0272-426.666667-426.666667-426.666667S87.3472 275.063467 87.3472 510.702933zM906.5472 510.702933c0 216.456533-176.093867 392.5504-392.533333 392.5504-216.4736 0-392.533333-176.093867-392.533333-392.5504s176.059733-392.533333 392.533333-392.533333C730.453333 118.1696 906.5472 294.2464 906.5472 510.702933z" p-id="7303"></path>
                    <path d="M330.581333 536.593067 306.449067 560.7424 514.013867 768.290133 721.544533 560.7424 697.412267 536.593067 531.080533 702.941867 531.080533 288.836267 496.9472 288.836267 496.9472 702.941867Z" p-id="7304"></path>
                  </svg>
                </i>
              </a>
            </header>
            <main className="comments-wrapper">
              <div className="comments-list">
                {comments}
              </div>
              <div className="comment-box-wrapper">
                <CommentBox
                  handleUserComment={this.handleUserComment}
                  targetPostId={article._id}
                />
              </div>
            </main>
          </div>
        </footer>
      </article>
    )
  }
}
