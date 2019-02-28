import React, { Component } from 'react'

import ReplyItem from './ReplyItem'
import {sortCommentItems} from '../../common/utils'

export default class CommentItem extends Component {
  flatComments (flatResult, c) {
    for (let i = 0, len = c.length; i < len; i++) {
      if (c[i].replies) {
        flatResult.splice(flatResult.length, 0, ...c[i].replies)
        return this.flatComments(flatResult, c[i].replies)
      }
    }
  }
  render () {
    let {comment, number} = this.props,
        replies = []
    this.flatComments(replies, [comment])
    let replyItems = sortCommentItems(replies).map(
      r => <ReplyItem key={r._id} comment={r} />
    )
    return (
      <div className="comment-item">
        <ReplyItem rootComment={number} comment={comment} />
        {replyItems}
      </div>
    )
  }
}
