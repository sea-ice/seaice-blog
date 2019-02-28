import fetch from 'isomorphic-fetch'

import config from '../config'

// 获取所有标签
export function getAllTags () {
  let query = `
    query {
      allTags {
        _id
        class
        name
      }
    }
  `
  return fetch(`${config.SERVER_URL}/graphql?query=${query}`)
    .then(response => response.json())
    .then(response => {
      return response.data
    })
}

export function getPostsByTagId (tagId, newPage, itemsPerPage) {
  let query = `
    query {
      totalItemsInTags(tagId:${tagId})
      pageDataInTags(tagId:${tagId}, skip:${(newPage - 1) * itemsPerPage}, limit:${itemsPerPage}) {
        _id
        title
        excerpt
        visitCount
        commentCount
        tags {
          _id
          name
        }
        location {
          country
          province
          city
        }
        publishTime {
          year
          month
          date
          hour
          minute
        }
      }
    }
  `
  return fetch(`${config.SERVER_URL}/graphql?query=${query}`)
  .then(response => response.json())
  .then(response => {
    return response.data
  })
}
