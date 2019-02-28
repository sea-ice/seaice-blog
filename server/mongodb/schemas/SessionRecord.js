import mongoose from 'mongoose'

const SessionRecord = new mongoose.Schema({
  _id: Number,
  visitTime: {
    type: Date,
    default: Date.now
  },
  visitor: {
    type: Number,
    ref: 'user'
  },
  location: {
    country: {
      type: String,
      default: 'China'
    },
    province: String,
    city: String
  }
})

export default mongoose.model('session-record', SessionRecord)
