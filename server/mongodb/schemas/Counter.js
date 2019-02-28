import mongoose from 'mongoose'

const CounterSchema = new mongoose.Schema({
  _id: String,
  lastUsedCount: {
    type: Number,
    default: 1
  }
})

let CounterModel = mongoose.model('counter', CounterSchema)
export default CounterModel
export async function getNewCount (key) {
  // upsert选项为true表示当文档不存在时自动插入新的文档
  let newRecord = await CounterModel.findOneAndUpdate({
    _id: key
  }, {
    $inc: {
      lastUsedCount: 1
    }
  }, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  })
  return newRecord.lastUsedCount
}
