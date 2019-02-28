// node-elasticsearch 使用参考：https://www.oschina.net/translate/search-engine-node-elasticsearch

import config from '../config'
let elasticsearch = require('elasticsearch')

export function connectES () {
  let esClient = new elasticsearch.Client({
    es_addr: config.elastic_addr,
    log: 'error'
  })
  return esClient
}

/**
 * 批量导入数据
 * @param {*} index
 * @param {*} type
 * @param {*} data
 * @param {*} fields 需要保存到elasticsearch的字段
 */
export function bulkData (index, type, data, fields) {
  let bulkBody = []
  fields = fields || ['title', 'content', 'tags']
  for (let item of data) {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item._id
      }
    })
    // delete item._id // 添加到全文搜索的字段不能包含_id
    // 筛选指定字段，防止向elasticsearch中添加无效字段
    let pick = {}
    for (let field of fields) {
      pick[field] = item[field]
    }
    bulkBody.push(pick)
  }

  let esClient = connectES()
  // bulk方法可以用于在一次请求中完成多个操作
  // 上面的bulkBody列出了向elasticsearch中添加的数据
  return esClient.bulk({
    body: bulkBody
  }).then(response => {
    console.log(response)
    let errorCount = 0
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        errorCount++
        console.log(errorCount, item.index.error)
      }
    })
    console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`)
    return errorCount === 0
  }).catch(err => {
    console.log(err)
    return false
  })
}

export function bulkUpdate (index, type, newData, fields) {
  let bulkBody = []
  fields = fields || ['title', 'content', 'tags']
  for (let item of newData) {
    bulkBody.push({
      update: {
        _index: index,
        _type: type,
        _id: item._id
      }
    })
    // 筛选指定字段，防止向elasticsearch中添加无效字段
    let pick = {}
    for (let field of fields) {
      pick[field] = item[field]
    }
    bulkBody.push({
      doc: pick
    })
  }
  let esClient = connectES()
  // bulk方法可以用于在一次请求中完成多个操作
  // 上面的bulkBody列出了向elasticsearch中添加的数据
  return esClient.bulk({
    body: bulkBody
  }).then(response => {
    console.log(response)
    if (response.update && response.update.status === 200) {
      console.log(`Successfully update`)
      return true
    } else {
      return false
    }
  }).catch(err => {
    console.log(err)
    return false
  })
}

/**
 * 批量删除指定id的数据
 * @param {*} index
 * @param {*} type
 * @param {*} ids 格式：[2, 3, 5]
 */
export function bulkDelete (index, type, ids) {
  let bulkBody = []
  for (let id of ids) {
    bulkBody.push({
      delete: {
        _index: index,
        _type: type,
        _id: id
      }
    })
  }
  let esClient = connectES()
  return esClient.bulk({
    body: bulkBody
  }).then(response => {
    if (response.delete && response.delete.status === 200) {
      console.log('Delete successfully!')
      return true
    } else {
      return false
    }
  }).catch(err => {
    console.log(err)
    return false
  })
}

export function deleteIndex (index) {
  let esClient = connectES()
  return esClient.indices.delete({
    index
  })
}
