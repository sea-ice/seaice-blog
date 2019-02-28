//
let Geetest = require('gt3-sdk')
let config = require('../config').default

function gt3Init (router) {
  let commentCaptcha = new Geetest({
    geetest_id: config.geetest_id,
    geetest_key: config.geetest_key
  });

  router.get("/gt/comment-register", async ctx => {
    let registerResult = await new Promise((resolve, reject) => {
      // 向极验申请每次验证所需的challenge
      commentCaptcha.register({
        client_type: 'unknown',
        ip_address: 'unknown'
      }, function (err, data) {
        // 用户一旦调用此接口，重置commentValid标志位
        console.log(err)
        console.log(data)
        resolve({
          err,
          data
        })
      });
    })
    // 当上面的promise变成rejected状态时，当前的异步函数便不会再往下执行
    // 因此上面的promise在注册失败的时候也需要转化为resolve状态
    let {err, data} = registerResult
    if (err) {
      console.error(err);
      ctx.body = JSON.stringify({
        code: 1,
        message: err
      })
    } else {
      ctx.body = JSON.stringify({
        code: 0,
        data
      })
    }

  });

  return commentCaptcha
}

module.exports = {
  gt3Init
}
