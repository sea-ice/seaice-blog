import PostModel from '../mongodb/schemas/Post'
import TagModel from '../mongodb/schemas/Tag'
import config from '../config'
import {bulkData} from './utils'

export async function importData () {
  let posts = await PostModel.find({
    isDraft: false,
    isIndependentPage: false
  })

  for (let post of posts) {
    let tags = await Promise.all(post._doc.tags.map(
      _id => TagModel.findOne({
        _id
      })))
    post._doc.tags = tags.map(tag => tag._doc.name)
  }

  // 过滤出用于全文搜索的字段
  posts = posts.map(item => ({
    _id: item._doc._id,
    title: item._doc.title,
    content: item._doc.content,
    tags: item._doc.tags
  }))
  // console.log(posts)
  bulkData(config.elastic_index_name, config.elastic_type_name, posts)
}
