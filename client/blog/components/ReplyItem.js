import React, { Component } from 'react'
import Loadable from 'react-loadable'
import Loading from '../../common/components/Loading'

import {formatEmojiText} from '../../common/utils'
import {USER_TOKEN_KEY, lStorageGetAndSet} from '../../common/utils/storage'
import {formatDate} from '../../../common/utils'

let CommentBox = Loadable({
  loader: () => import(
    /* webpackChunkName: "CommentBox" */
    './CommentBox'
  ),
  loading: Loading
})

export default class ReplyItem extends Component {
  constructor (props) {
    super(props)
    this.toggleCommentBox = this.toggleCommentBox.bind(this)
    this.visitorToken = lStorageGetAndSet(USER_TOKEN_KEY)
  }
  componentDidMount () {
    this.content.innerHTML = formatEmojiText(this.props.comment.content)
    import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ).then($ => this.$ = $)
  }
  toggleCommentBox () {
    this.$(this.replyButtonWrapper).toggleClass('show-comment-box')
  }
  render () {
    let {comment, rootComment} = this.props,
        {nickname, avatar, token} = comment.publisher
    return (
      <section className="reply-item">
        <header className="commentator-info">
          {/* avatar ?
          <i className={`avatar avatar-${avatar}`}></i>
          : */}
          {/* <div
            className="avatar"
            ref={ele => this.noAvatar = ele}
          >
            <p className="nickname-first-letter">{this.nameFirstLetter}</p>
          </div> */}
          <div className="commentator-wrapper">
            <p className="commentator-nickname">
              {rootComment ?
                <span>
                  {comment.publisher.nickname}&nbsp;
                  <span className="chinese-word">评论道：</span>
                </span> :
                <span>{
                      comment.publisher.nickname
                  } &nbsp;
                  <span className="chinese-word">回复</span>
                  &nbsp;&nbsp;{comment.replyToUser}&nbsp;
                  <span className="chinese-word">说：</span>
                </span>
              }
            </p>
            {
              rootComment &&
              <p className="comment-floor-count">
                #&nbsp;{rootComment}
              </p>
            }
          </div>
          <p className="comment-time">
            <time>
              {formatDate(comment.publishTime, 'number-format')}
            </time>
          </p>
        </header>
        <main className="comment-body">
          <p className="quote-left-wrapper"><i></i></p>
          <p
            className="comment-content"
            ref={ele => this.content = ele}
          ></p>
          <div
            className="quote-right-wrapper"
            ref={ele => this.replyButtonWrapper = ele}
          >
            {
              this.visitorToken === token ?
                <div className="placeholder"></div>
              :
                <a
                  href="javascript:void(0);"
                  className="reply-button"
                  onClick={this.toggleCommentBox}
                >
                  <i>
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path d="M448 775.616V1024l-384-384 384-384v253.824c446.72 10.496 427.584-303.808 313.856-509.824C1042.56 303.424 982.976 789.568 448 775.616z"></path>
                    </svg>
                  </i>
                  <span>回复</span>
                </a>
            }
            <i></i>
          </div>
          <div
            className="reply-box-container-wrapper"
          >
            <div className="reply-box-container">
              <div className="reply-box-wrapper">
                <h3>回复&nbsp;<span className="reply-to-commentator">{nickname}&nbsp;:</span></h3>
                <CommentBox
                  replyTo={comment._id}
                  targetPostId={comment.belongToPost._id} />
              </div>
            </div>
          </div>
        </main>
      </section>
    )
  }
}
