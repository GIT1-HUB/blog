const Koa = require('koa')
const consola = require('consola')
const {
  Nuxt,
  Builder
} = require('nuxt')
var bodyParser = require('koa-bodyparser');
import mongoose from 'mongoose'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
const fs = require('fs');
// const koaBody = require('koa-body');
const path = require('path')
import dbConfig from './dbs/config'
import Blog from './interface/blog'
import Comment from './interface/comment'
import BlogUser from './interface/bloguser'
import Adminuser from './interface/adminuser'
import passport from './interface/utils/passport'
import staticFiles from 'koa-static'
const app = new Koa()
app.use(bodyParser());
// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

// 指定 public目录为静态资源目录，用来存放 images 
app.use(staticFiles(path.join(__dirname, '../public/')))
// koaBody 配置
// app.use(koaBody({
//   multipart:true, // 支持文件上传
//   encoding:'gzip',
//   formidable:{
//     uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
//     keepExtensions: true,    // 保持文件的后缀
//     maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
//     onFileBegin:(name,file) => { // 文件上传前的设置
//       // console.log(`name: ${name}`);
//       // console.log(file);
//     },
//   }
// }));

// 配置session
app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({
  key: 'mt',
  prefix: 'mt:uid',
  store: new Redis(),
  // cookie:{
  //     path: '/',
  //     httpOnly: true,
  //     maxAge: 24 * 60 * 60 * 1000, //one day in ms,
  //     overwrite: true,
  //     signed: true
  // }
}))
// app.use(bodyParser({
//   extendTypes: ['json', 'form', 'text']
// }))
app.use(json())
app.use(passport.initialize())
app.use(passport.session())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  // port = 
  const {
    host = process.env.HOST || '0.0.0.0',
      port = process.env.PORT || '80'
  } = nuxt.options.server
  console.log(process.env.PORT)
  // console.log(nuxt.options.server);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // 各种api
  app.use(Blog.routes()).use(Blog.allowedMethods())
  app.use(Comment.routes()).use(Comment.allowedMethods())
  app.use(BlogUser.routes()).use(BlogUser.allowedMethods())
  app.use(Adminuser.routes()).use(Adminuser.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })




  // 监听端口
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
