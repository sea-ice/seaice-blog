import config from '../config'
import TagModel from '../mongodb/schemas/Tag'
import PostModel from '../mongodb/schemas/Post'
import {importData} from '../elasticsearch/import'
import {search, getAllRecords} from '../elasticsearch/search'
import {formatPostList} from '../utils'
import {bulkUpdate, bulkDelete, deleteIndex} from '../elasticsearch/utils'

import {testBulkUpdate, testBulkDelete} from '../elasticsearch/test'

export function initializeES (router) {

  // 删除索引重新导入数据
  // deleteIndex(config.elastic_index_name).then(() => {
  //   importData()
  // })

  // search(config.elastic_index_name, '黄思仪').then(response => {
  //   console.log(`found ${response.hits.total} items in ${response.took}ms`)
  //   response.hits.hits.forEach(item => {
  //     console.log(item._id, ': ', item._source.title)
  //   })
  // })
  router.get('/search', async ctx => {
    let query = ctx.request.query.query
    let searchResult = await search(
      config.elastic_index_name,
      query
    ).then(response => {
      return response.hits.hits
    })
    searchResult = await Promise.all(
      searchResult.map(
        item => PostModel.findOne({
          _id: item._id
        }).select(['title', 'excerpt', 'visitCount', 'tags', 'publishTime', 'location']
    )))
    // console.log(searchResult)
    searchResult = await formatPostList(searchResult)
    ctx.body = JSON.stringify({
      code: 0,
      data: searchResult
    })
  })
}
