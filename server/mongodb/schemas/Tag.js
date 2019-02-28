import mongoose from 'mongoose'

const TagSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  createTime: {
    type: Date,
    default: Date.now
  },
  class: String
})

export default mongoose.model('tag', TagSchema)
