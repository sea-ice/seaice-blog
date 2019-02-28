import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
  _id: Number,
  publisher: {
    type: Number,
    ref: 'user'
  },
  content: String,
  replyTo: {
    // 值为-1表示文章评论，为其他值表示文章回复
    type: Number,
    ref: 'comment'
  },
  location: {
    country: {
      type: String,
      default: 'China'
    },
    province: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    }
  },
  publishTime: {
    type: Date,
    default: Date.now
  },
  belongToPost: {
    type: Number,
    ref: 'post'
  }
})

export default mongoose.model('comment', CommentSchema)
