import htmlparser from 'htmlparser2'

import {transformMarkdown} from '../../common/utils'
import {getNewCount} from '../mongodb/schemas/Counter'

import PostModel from '../mongodb/schemas/Post'

function initPostsInterface (router) {
  /*
  接口说明：
  功能：用于提交发表一篇完整的博客(本质上是在设置post记录的isDraft)
  方法：POST
  接口参数：
  id: 草稿ID
  title: 字符串类型，博客标题
  content: 字符串类型，博客正文内容
  tags: 数组类型，文章标签，注意数组中的元素是标签的ID
  isIndependentPage: 值为false或者非空的字符串
  location: 对象类型，包含province和city属性
  */
  router.post('/post', async ctx => {
    let postData = ctx.request.body
    let iPage = postData.isIndependentPage
    let ipageUrlValid = (iPage === false) || iPage.trim()
    // 独立页面可以不选择标签，非独立页面必须选择标签
    let tagsValid = iPage === false ? (Object.prototype.toString.call(postData.tags) === '[object Array]' &&
    postData.tags.length) : true
    if (
      postData.id &&
      postData.title &&
      postData.content &&
      tagsValid &&
      postData.location.province &&
      postData.location.city &&
      ipageUrlValid
    ) {
      let _id = postData.id,
          post = await PostModel.findOne({
            _id
          })
      if (post._doc.isDraft === false) {
        // 设置ctx.body属性并不代表函数就直接返回
        ctx.body = JSON.stringify({
          code: 2,
          message: '该文章已发布过了，请勿重复发布！'
        })
      } else {
        // 获取文章摘要和markdown转换结果
        let htmlAfterTransform = transformMarkdown(postData.content),
            excerpt = '', targetText = false,
            parser = new htmlparser.Parser({
              onopentag (name, attrs) {
                if (
                  (name === 'blockqueto' || name === 'p') &&
                  excerpt.length < 120
                ) {
                  targetText = true
                }
              },
              ontext (text) {
                if (targetText) {
                  excerpt += text
                }
              },
              onclosetag (name) {
                if (name === 'blockqueto' || name === 'p') {
                  targetText = false
                }
              }
            }, {decodeEntities: true})
        parser.write(htmlAfterTransform.split('\n').join(''))
        parser.end()
        // console.log(excerpt)
        await PostModel.findOneAndUpdate({
          _id
        }, {
          title: postData.title,
          content: postData.content,
          isIndependentPage: Boolean(iPage),
          pageReferUrl: iPage || '',
          isDraft: false,
          publishTime: Date.now(),
          lastModifiedAt: Date.now(),
          tags: iPage === false ? postData.tags : [], // 独立页面即使选了标签也置为空
          htmlAfterTransform,
          excerpt,
          location: {
            province: postData.location.province,
            city: postData.location.city
          }
        }, {
          upsert: true,
          setDefaultsOnInsert: true
        })
        ctx.body = JSON.stringify({
          code: 0,
          _id
        })
      }
    } else {
      ctx.body = JSON.stringify({
        code: 1,
        message: '提交的信息不足，发布失败！'
      })
    }
  })

  // 撤销发布接口
  router.del('/post', async ctx => {
    let postId = ctx.request.body.id,
        post = await PostModel.findOneAndUpdate({
          _id: postId,
          isDraft: false
        }, {
          isDraft: true
        })
    console.log(post)
    if (post) {
      ctx.body = JSON.stringify({
        code: 0,
        data: {
          id: postId
        }
      })
    } else {
      ctx.body = JSON.stringify({
        code: 1,
        message: '撤销发布失败，指定id的文章尚未发布！'
      })
    }
  })

  // 恢复对文章的撤销
  router.put('/post', async ctx => {
    let {id} = ctx.request.body,
        newPost = await PostModel.findOneAndUpdate({
          _id: id,
          isDraft: true,
          inRecycleBin: true
        }, {
          inRecycleBin: false
        })
    if (newPost) {
      ctx.body = JSON.stringify({
        code: 0,
        data: {
          ...newPost._doc
        }
      })
    } else {
      ctx.body = JSON.stringify({
        code: 1,
        message: '指定的文章不存在！'
      })
    }
  })

  router.get('/posts', async ctx => {
    let fields = {
      _id: 1,
      title: 1,
      lastModifiedAt: 1
    }
    let drafts = (await PostModel.find({
      isDraft: true,
      inRecycleBin: false
    }, fields)) || []
    let independentPages = (await PostModel.find({
      isDraft: false,
      isIndependentPage: true,
      inRecycleBin: false
    }, fields)) || []
    let publishedPosts = (await PostModel.find({
      isDraft: false,
      isIndependentPage: false,
      inRecycleBin: false
    }, fields)) || []
    let recycledDrafts = (await PostModel.find({
      inRecycleBin: true
    }, fields)) || []
    ctx.body = JSON.stringify({
      code: 0,
      data: {
        drafts,
        independentPages,
        publishedPosts,
        recycledDrafts
      }
    })
  })

  router.get('/post', async ctx => {
    // let fields = {
    //   content: 1
    // }
    let postId = ctx.request.query.id
    let post = (await PostModel.findOne({
      _id: postId
    }))
    if (post) {
      ctx.body = JSON.stringify({
        code: 0,
        data: {
          ...post._doc
        }
      })
    } else {
      ctx.body = JSON.stringify({
        code: 1,
        message: '查找的文章不存在！'
      })
    }
  })

  /*
  接口说明：
  功能：用于新建一篇草稿
  方法：POST
  接口参数：
  title: 字符串类型，博客标题
  content: 字符串类型，博客正文内容
  tags: 数组类型，文章标签
  isIndependentPage: 值为false或者对象，如果是对象，则需要包含url属性，用于指定独立页面的访问路径
  location: 对象类型，包含province和city属性
  */
  router.post('/draft', async ctx => {
    let postData = ctx.request.body
    console.log(postData)
    if (
      postData.title ||
      postData.content ||
      (Object.prototype.toString.call(postData.tags) === '[object Array]' && postData.tags.length) ||
      postData.isIndependentPage ||
      postData.location.province ||
      postData.location.city
    ) {
      let _id = postData.id || await getNewCount('post')
      console.log(_id)
      await PostModel.findOneAndUpdate({
        _id
      }, {
        title: postData.title,
        content: postData.content,
        tags: postData.tags || [],
        isIndependentPage: Boolean(postData.isIndependentPage),
        isDraft: true,
        lastModifiedAt: Date.now(),
        location: {
          province: postData.location.province,
          city: postData.location.city
        }
      }, {
        upsert: true,
        setDefaultsOnInsert: true
      })
      ctx.body = JSON.stringify({
        code: 0,
        data: {
          _id
        }
      })
    } else {
      ctx.body = JSON.stringify({
        code: 1,
        message: '提交的信息不足，无法创建草稿'
      })
    }
  })

  // 删除草稿(如果草稿在回收站中则彻底删除，如果不在回收站中则添加到回收站)
  router.del('/draft', async ctx => {
    let postId = ctx.request.body.id,
        post = await PostModel.findOne({
          _id: postId
        })
    if (post) {
      if (post.isDraft) {
        if (post.inRecycleBin) {
          await PostModel.remove({
            _id: postId
          })
          ctx.body = JSON.stringify({
            code: 0,
            data: {
              id: postId,
              fakeRemoved: false
            }
          })
        } else {
          await PostModel.findOneAndUpdate({
            _id: postId
          }, {
            inRecycleBin: true
          })
          ctx.body = JSON.stringify({
            code: 0,
            data: {
              id: postId,
              fakeRemoved: true
            }
          })
        }
      } else {
        ctx.body = JSON.stringify({
          code: 2,
          message: '删除失败，只能对草稿进行删除操作！'
        })
      }
    } else {
      ctx.body = JSON.stringify({
        code: 1,
        message: '查找的文章不存在！'
      })
    }
    console.log(post)
    if (post) {
      ctx.body = JSON.stringify({
        code: 0,
        data: {
          id: postId
        }
      })
    } else {
      ctx.body = JSON.stringify({
        code: 1,
        message: '草稿放入回收站失败，指定id的文章不为草稿亦或者已被放入回收站！'
      })
    }
  })
}

export {
  initPostsInterface
}
