import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  _id: Number,
  nickname: String,
  avatar: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  token: String
})

export default mongoose.model('user', UserSchema)
