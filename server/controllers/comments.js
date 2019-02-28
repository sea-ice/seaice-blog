import CommentModel from '../mongodb/schemas/Comment'
import PostModel from '../mongodb/schemas/Post'
import UserModel from '../mongodb/schemas/User'

import {getNewCount} from '../mongodb/schemas/Counter'
import {formatDate} from '../../common/utils'

let VALID_EMAIL_REG_EXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/

function initCommentsInterface (router, commentCaptcha) {
  router.post('/comment', async ctx => {
    // 用户发表评论成功的两种情况：
    // 必要字段：content, belongToPost
    // 可选字段：token 或者 nickname+email
    let {
      content = '',
      token,
      belongToPost,
      replyTo,
      nickname = '',
      email = '',
      geetest_challenge,
      geetest_validate,
      geetest_seccode,
      fallback
    } = ctx.request.body
    if (geetest_challenge && geetest_validate && geetest_seccode) {
      let validateResult = await new Promise(resolve => {
        commentCaptcha.validate(fallback, {
          geetest_challenge,
          geetest_validate,
          geetest_seccode
        }, function (err, success) {
          resolve({
            err,
            success
          })
        });
      })
      let {err, success} = validateResult
      if (err) {
        // 网络错误
        console.error(err)
        ctx.body = JSON.stringify({
          code: 1,
          message: err
        })

      } else if (!success) {
        // 二次验证失败
        ctx.body = JSON.stringify({
          code: 2,
          message: 'invalid request'
        })
      } else {
        // 进入正常的添加评论逻辑
        let userId, err, newUser, checkReplyTo = false
        if (token) {
          let user = await UserModel.findOne({
            token
          })
          if (user) {
            // 有效用户
            userId = user._id
            // 需要检查是否回复的是用户本人
            checkReplyTo = true
          } else {
            // 无效token
            err = {
              code: 1,
              message: '参数无效'
            }
          }
        } else {
          // 新用户
          if (nickname && email) {
            nickname = nickname.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
            email = email.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
            let user = await UserModel.findOne({
              nickname
            })
            if (!user) {
              // 用户填写的昵称不存在
              if (email.match(VALID_EMAIL_REG_EXP)) {
                let emailExsits = await UserModel.findOne({
                  email
                })
                if (emailExsits) {
                  // 同一邮箱（认为是同一用户），使用了不同的昵称
                  // 邮箱已被使用，则更新用户资料
                  let update = {nickname}
                  await UserModel.updateOne({
                    email
                  }, update)
                  token = emailExsits.token
                  userId = emailExsits._id
                  checkReplyTo = true
                } else {
                  // 邮箱地址和昵称均是新的
                  let newUserId = await getNewCount('user')
                  token = Date.now()
                  newUser = new UserModel({
                    _id: newUserId,
                    nickname,
                    email,
                    token
                  })
                  await newUser.save()
                  userId = newUserId
                }
              } else {
                err = {
                  code: 1,
                  message: '请填写正确的邮箱'
                }
              }
            } else {
              if (user.email === email) {
                // 同一个用户（相同昵称相同邮箱地址）在不同设备上评论
                token = user.token
                userId = user._id
                checkReplyTo = true
              } else {
                // 用户名已被占用
                err = {
                  code: -1,
                  message: '该昵称已经被他人使用了呢，请换一个试试~'
                }
              }
            }
          } else {
            err = {
              code: 1,
              message: '请填写昵称和邮箱地址~'
            }
          }
        }
        if (checkReplyTo) {
          if (replyTo) {
            let replyToComment = await CommentModel.findOne({
              _id: replyTo
            })
            if (
              replyToComment
              && replyToComment.publisher === Number(userId)
            ) {
              err = {
                code: 1,
                message: '不能对自己的评论进行回复~'
              }
            } else if (!replyToComment) {
              err = {
                code: 1,
                message: '回复的评论不存在~'
              }
            }
          }
        }
        if (!err) {
          content = content.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
          let targetPost = await PostModel.findOne({
            _id: Number(belongToPost),
            isDraft: false
          })
          if (
            content
            && targetPost
          ) {
            let newComment  = new CommentModel({
              _id: await getNewCount('comment'),
              publisher: userId,
              content,
              replyTo: Boolean(replyTo) ? replyTo : -1,
              belongToPost: targetPost._id
            })
            await newComment.save()

            // 格式化数据并返回给客户端
            let result = newComment._doc
            result.publishTime = formatDate(result.publishTime, 'object-format')
            result.publisher = await UserModel.findOne({
              _id: result.publisher
            })
            ctx.body = JSON.stringify({
              code: 0,
              data: {
                token,
                comment: result
              }
            })
          } else {
            ctx.body = JSON.stringify({
              code: 1,
              message: '参数错误'
            })
          }
        } else {
          ctx.body = JSON.stringify(err)
        }
      }
    } else {
      ctx.body = JSON.stringify({
        code: -1,
        message: '非法请求'
      })
    }
  })
}

export {
  initCommentsInterface
}
