import fetch from 'isomorphic-fetch'

import config from '../config'

/**
 * 获取文章搜索列表
 * @param {*} query
 */
export function getSearchResult (query) {
  return fetch(
    `${config.SERVER_URL}/search?query=${query}`
  ).then(response => response.json())
}
