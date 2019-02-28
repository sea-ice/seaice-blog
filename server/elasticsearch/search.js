import {connectES} from './utils'

export function search (index, query) {
  let esClient = connectES()
  return esClient.search({
    index,
    body: {
      query: {
        multi_match: {
          query,
          fields: ['title', 'content']
        }
      }
    }
  })
}

export function getAllRecords (index) {
  let esClient = connectES()
  return esClient.search({
    index,
    body: {
      query: {
        match_all: {}
      }
    }
  })
}
