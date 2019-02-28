import {ajax} from '../../../common/utils'
import config from '../../config'

/**
 * 极验客户端初始化
 */
export function initializeGt () {
  return ajax(
    'GET',
    `${config.SERVER_URL}/gt/comment-register`
  )
}
