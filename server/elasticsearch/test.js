import config from '../config'
import {bulkData, bulkUpdate, bulkDelete} from './utils'

export function testInsertData () {
  bulkData(config.elastic_index_name, config.elastic_type_name, [{
    _id: 1000,
    title: '周海彬的个人博客',
    content: '测试测试',
    tags: [1234]
  }])
}

export function testBulkUpdate () {
  bulkUpdate(config.elastic_index_name, config.elastic_type_name, [{
    _id: 1000,
    title: '黄思仪的个人日记'
  }])
}

export function testBulkDelete () {
  bulkDelete(config.elastic_index_name, config.elastic_type_name, [1000])
}
