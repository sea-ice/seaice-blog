import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  content: String,
  isIndependentPage: Boolean,
  pageReferUrl: {
    type: String,
    default: ''
  },
  isDraft: Boolean,
  inRecycleBin: {
    type: Boolean,
    default: false
  },
  publishTime: Date,
  excerpt: String,
  htmlAfterTransform: String,
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: Number,
    ref: 'tag' // ref属性值为某个model的名称
  }],
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
  visitCount: {
    type: Number,
    default: 0
  }
})

// 此处传递给model方法的第一个参数表示model的名称，mongoose会将其自动对应到名称为其对应复数形式的集合上
// 即此处的post Model会自动对应到数据库中posts集合
export default mongoose.model('post', PostSchema)
