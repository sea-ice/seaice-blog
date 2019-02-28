import {firstLetterOfName} from '../../common/utils'
import {getNewCount} from '../mongodb/schemas/Counter'

import TagModel from '../mongodb/schemas/Tag'

function initTagsInterface (router) {
  /*
  接口说明：
  功能：用于新建一个标签
  方法：POST
  接口参数：
  name: 标签名称
  */
  router.post('/tag', async ctx => {
    let name = ctx.request.body.name.trim()
    if (name) {
      let tag = await TagModel.findOne({
        name
      })
      if (tag) {
        ctx.body = JSON.stringify({
          code: 1,
          message: '标签已存在，请勿重复创建！'
        })
      } else {
        let tagClass = firstLetterOfName(name),
            newTagId = await getNewCount('tag'),
            newTag = new TagModel({
              _id: newTagId,
              name,
              class: tagClass.toUpperCase()
            })
        await newTag.save()
        ctx.body = JSON.stringify({
          code: 0,
          data: {
            _id: newTagId
          }
        })
      }
    }
  })

  /*
  接口说明：
  功能：用于获取所有的标签
  方法：GET
  */
  router.get('/tags', async ctx => {
    let tags = (await TagModel.find()) || []
    ctx.body = JSON.stringify({
      code: 0,
      data: {
        tags
      }
    })
  })
}

export {
  initTagsInterface
}
