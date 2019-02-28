import fetch from 'isomorphic-fetch'

import config from '../config'

// 获取首页和归档页中的文章列表
export function getPagePosts (newPage, itemsPerPage) {
  let query = `
        query {
          totalItemsInHome
          pageDataInHome(page:${newPage}, itemsPerPage:${itemsPerPage}) {
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

/**
 * 获取指定id的文章详情
 * @param {*} postId
 */
export function getPostDetail (postId) {
  let postQuery = `query {
    post(id:${postId}){
      _id
      title
      content
      tags {
        name
      }
      visitCount
      publishTime {
        year
        month
        date
        hour
        minute
      }
      lastModifiedAt {
        year
        month
        date
        hour
        minute
      }
      location {
        province
        city
      }
      comments {
        ...commentFields
      }
    }
  }
  fragment commentFields on Comment {
    _id
    content
    belongToPost {
      _id
    }
    publishTime {
      year
      month
      date
      hour
      minute
    }
    publisher {
      _id
      nickname
      email
      avatar
      token
    }
    location {
      country
      province
      city
    }
    replyTo
  }
  `
  return fetch(
    `${config.SERVER_URL}/graphql?query=${postQuery}`
  ).then(
    response => response.json()
  )
}

/**
 * 获取已发表的独立页面
 */
export function getIPagePosts () {
  let query = `
        query {
          IPagePosts {
            _id
            pageReferUrl
          }
        }
      `
  return fetch(`${config.SERVER_URL}/graphql?query=${query}`)
    .then(response => response.json())
    .then(response => {
      return response.data
    })
}

export function getHotArticles () {
  let query = `
  query {
    hotArticles {
      _id
      title
      visitCount
    }
  }`
  return fetch(`${config.SERVER_URL}/graphql?query=${query}`)
    .then(response => response.json())
    .then(response => {
      return response.data
    })
}
