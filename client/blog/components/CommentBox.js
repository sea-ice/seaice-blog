import React, {Component} from 'react'

import config from '../../config'
import {formatEmojiText} from '../../common/utils'
import {ajax} from '../../../common/utils'
import {initializeGt} from '../../common/utils/gtest'
import {
  USER_TOKEN_KEY,
  lStorageGetAndSet
} from '../../common/utils/storage'

class CommentBox extends Component {
  constructor (props) {
    super(props)
    this.toggleEmojiList = this.toggleEmojiList.bind(this)
    this.hideEmojiList = this.hideEmojiList.bind(this)
    this.previewComment = this.previewComment.bind(this)

    this.selectEmoji = this.selectEmoji.bind(this)
    this.publishComment = this.publishComment.bind(this)

    // this.props.replyTo：可选，传值表示回复，不传表示评论
    // this.props.targetPostId：必须
    this.state = {
      commentBoxState: 'writing',
      token: lStorageGetAndSet(USER_TOKEN_KEY),
      loadingGt: true,
      loadGtError: false
    }
  }
  componentDidMount () {
    // this.props.initializeGt()
    console.log('comment box mounted')
    Promise.all([import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ), import(
      /* webpackChunkName: "gt_client" */
      '../../resources/common/js/gt_client'
    )]).then(res => {
      this.$ = res[0]
      if (this.props.replyTo) {
        // 回复框

      } else {
        // 评论框
        this.loadGt()
      }
    }).catch(err => {
      console.log(err)
    })
  }
  loadGt () {
    let self = this
    if (this.valid) {
      this.valid = false
      this.$(this.gtestWrapper).find(
        '.geetest_holder.geetest_wind'
      ).remove()
    }
    this.setState({
      loadingGt: true
    })
    initializeGt().then(data => {
      //请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
      window.initGeetest({
        // 以下配置参数来自服务端 SDK
        gt: data.gt,
        challenge: data.challenge,
        offline: !data.success,
        new_captcha: true,
        product: 'float'
      }, function (captchaObj) {
        // 这里可以调用验证实例 captchaObj 的实例方法
        captchaObj.appendTo(self.gtestWrapper)
        self.setState({
          loadingGt: false,
          loadGtError: false
        })
        captchaObj.onReady(function () {
          //your code
        }).onSuccess(function () {
          //your code
          self.valid = captchaObj.getValidate()
          self.valid.fallback = !data.success
        }).onError(function () {
          //your code
        })
      })
    }).catch(err => {
      this.setState({
        loadingGt: false,
        loadGtError: true
      })
    })
  }
  toggleEmojiList () {
    if (this.state.commentBoxState === 'preview') return
    this.$(this.emojiList).toggleClass('show')
  }
  hideEmojiList () {
    if (this.$(this.emojiList).hasClass('show')) {
      this.$(this.emojiList).removeClass('show')
    }
  }
  selectEmoji (e) {
    let emojiText = e.target.getAttribute('data-emoji-text')
    if (emojiText) {
      let commentText = this.comment.value,
          cursorPos = this.comment.selectionStart,
          newCursorPos = cursorPos + emojiText.length
      this.comment.value = commentText.slice(0, cursorPos) + emojiText + commentText.slice(cursorPos)
      this.toggleEmojiList()
      this.comment.focus()
      this.comment.setSelectionRange(newCursorPos, newCursorPos)
    }
  }
  previewComment (e) {
    let {commentBoxState} = this.state
    this.setState({
      commentBoxState: commentBoxState === 'preview' ? 'writing' : 'preview'
    })
  }
  publishComment () {
    if (!this.valid) {
      alert('请点击上方的按钮进行验证！如果二维码没有加载出来，请刷新页面重试！')
      return
    }
    let comment = this.comment.value.trim()
    if (comment) {
      let postData = {
        ...this.valid,
        content: comment,
        belongToPost: this.props.targetPostId,
        replyTo: this.props.replyTo || 0
      }
      if (this.state.token) {
        postData = Object.assign({}, postData, {
          token: this.state.token
        })
      } else {
        let nickname = this.nickname.value.trim(),
            email = this.email.value.trim(),
            VALID_EMAIL_REG_EXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
        if (!nickname) {
          return alert('请填写昵称~')
        }
        if (!email || !email.match(VALID_EMAIL_REG_EXP)) {
          return alert('请填写有效的邮箱地址~')
        }
        postData = Object.assign({}, postData, {
          nickname,
          email
        })
      }
      ajax(
        'POST',
        `${config.SERVER_URL}/comment`,
        postData
      ).then(data => {
        console.log(data)
        if (!this.state.token) {
          lStorageGetAndSet(USER_TOKEN_KEY, data.token)
        }
        alert('评论发表成功！')
        // 清空评论框中的内容
        this.comment.value = ''
        if (this.props.handleUserComment) {
          this.props.handleUserComment(data.comment)
        }
        // 刷新二维码
        this.loadGt()
      }).catch(err => {
        console.log(err)
        // 刷新二维码
        this.loadGt()
      })
    } else {
      alert('评论内容不允许为空！')
    }
  }
  render () {
    let emojiItems = Array.apply(null, {
      length: 30
    }).map((v, i) => (<li key={`emoji-icon-${i + 1}`}>
      <a href="javascript:void(0);">
        <i
          className={`emoji-icon emoji-icon-${i + 1}`}
          data-emoji-text={`[em:${i + 1}]`}
        ></i>
      </a>
    </li>))

    let {
      loadingGt,
      loadGtError,
      commentBoxState,
      token
    } = this.state
    let gtest
    if (loadingGt) {
      gtest = <p className="loading-gt">验证码加载中...</p>
    } else {
      if (loadGtError) {
        gtest = <p className="loading-gt-error">验证码加载失败</p>
      }
    }

    let previewContent = (
      this.comment && this.comment.value
    ) ? formatEmojiText(
      this.comment.value
    ) : <p className="nothing-preview">编辑内容后预览</p>

    return (
      <div
        className="comment-box"
        id={`comment-box-reply-to-${this.props.replyTo || 0}`}
      >
        <div
          className="emoji-list-wrapper"
          ref={ele => this.emojiList = ele}
          onClick={this.selectEmoji}
          onMouseLeave={this.hideEmojiList}
        >
          <ul className="emoji-list">
            {emojiItems}
          </ul>
        </div>
        <ul className="comment-operation-wrapper">
          <li>
            <a
              href="javascript:void(0);"
              onClick={this.toggleEmojiList}
            >
              <i className="emotion-icon"></i>
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0);"
              onClick={this.previewComment}
              className={commentBoxState === 'preview' ? 'active' : ''}
            >
              <i className="preview-icon"></i>
            </a>
          </li>
        </ul>
        <div className="comment-box-content">
          <textarea
            ref={ele => this.comment = ele}
            className={commentBoxState === 'writing' ? 'show' : ''}
          ></textarea>
          <div
            className={
              `comment-preview${
                commentBoxState === 'preview' ? ' show' : ''
              }`
            }
          >{previewContent}</div>
        </div>
        <div
          className={
            `user-info-wrapper${token ? '' : ' show'}`
          }
        >
          <div className="form-field">
            <label htmlFor="#user-nickname-input">起个响亮的名字吧(必填)</label>
            <input ref={ele => this.nickname = ele} type="text" id="user-nickname-input" />
          </div>
          <div className="form-field">
            <label htmlFor="#user-email-input">你的邮箱(必填，不公开)</label>
            <input ref={ele => this.email = ele} type="text" id="user-email-input" />
          </div>
        </div>
        <div
          className="gt-wrapper"
          ref={(ele) => this.gtestWrapper = ele}
        >
          {gtest}
        </div>
        <footer>
          <a
            href="javascript:void(0);"
            onClick={this.publishComment}
          >回&nbsp;复</a>
        </footer>
      </div>
    )
  }
}

export default CommentBox
