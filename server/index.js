import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import Router from 'koa-router'
import multer from 'koa-multer'
import serve from 'koa-static-server'
// import Session from 'koa-session'
import {gt3Init} from './controllers/gt3'
import {initGraphQL} from './controllers/graphql'
import {initPostsInterface} from './controllers/posts'
import {initCommentsInterface} from './controllers/comments'
import {initTagsInterface} from './controllers/tags'
import {initializeES} from './controllers/elasticsearch'

import config from './config'
import connectDatabase from './mongodb'
require('es6-promise').polyfill()
let cors = require('koa-cors')

connectDatabase()

let app = new Koa()
app.use(bodyparser())
app.use(serve({
  rootDir: 'server/upload',
  rootPath: '/upload'
}))

// 设置CORS允许的源
app.use(cors({
  origin: config.corsAllowOrigin,
  commentCaptcha: ['GET', 'POST', 'DELETE', 'PUT']
}))

// session初始化
// app.keys = ['saltsalt']
// app.use(Session(app))
// app.use(async ctx => {
//   let {sessionString} = ctx.request.body
//   if (ctx.session.str !== sessionString) {
//     ctx.body = JSON.stringify({
//       code: -1,
//       message: '非法请求'
//     })
//   }
// })

let router = new Router()
// 初始化极验
let commentCaptcha = gt3Init(router)

// 初始化GraphQL
initGraphQL(router)

// 初始化文章相关接口
initPostsInterface(router)

// 初始化评论相关接口
initCommentsInterface(router, commentCaptcha)

// 初始化文章标签相关接口
initTagsInterface(router)

// 初始化全文搜索引擎
initializeES(router)

// let express = require('express')
// let bodyParser = require('body-parser')

// let app = express()
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// router.get('/post', async ctx => {

// })

// 当前文件中的__dirname变量是‘/’，感觉很奇怪
console.log(__dirname)
let storage = multer.diskStorage({
  destination (req, file, cb) {
    // 此处的‘server/upload’会相对执行当前文件时的目录进行解析，也就是项目根目录
    cb(null, 'server/upload')
  },
  filename (req, file, cb) {
    let ext = file.originalname.split('.').pop()
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
  }
})
const upload = multer({
  storage
})
router.post('/upload', upload.single('postImage'), async ctx => {
  console.log(ctx.req.file)
  let {filename} = ctx.req.file,
      url = `${config.imageUploadURL}${filename}`
  ctx.body = JSON.stringify({
    code: 0,
    data: {
      url
    }
  })
})

app.use(router.routes())
app.use(router.allowedMethods())

const port = 3000
app.listen(port)
console.log(`Server has been listening on port ${port}`)

