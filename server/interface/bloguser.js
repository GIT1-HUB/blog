import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'

import User from '../dbs/model/bloguser'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'
import frontArticle from '../dbs/model/frontArticleSchema'
import comment from '../dbs/model/commentSchema'
import backArticle from '../dbs/model/backArticleSchema'
import path from 'path'
import fs from 'fs'
import commentconfig from '../dbs/model/commentConfigSchema'

const multer = require('koa-multer'); //加载koa-multer模块
//文件上传
//配置
var storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
var upload = multer({
  storage: storage
});

let router = new Router({
  prefix: '/bloguser'
})


let Store = new Redis().client

// 注册
router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body;

  console.log(ctx.request.body);

  if (code) {
    // 获取保存验证码
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    // 获取保存的验证码有效时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      // 如果当前时间大于验证码有效时间，验证码就过期了
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  let user = await User.find({
    username
  })
  // 如果已经有这个username了，就返回已经注册
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }

  // 如果前面的的情况都没有发生，就直接添加到数据库中
  let nuser = await User.create({
    username,
    password,
    email
  })
  console.log(nuser);

  // 如果添加成功
  if (nuser) {
    // 直接登录
    let res = await axios.post('/bloguser/signin', {
      username,
      password
    })
    // 如果登录成功，就说明注册成功了
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

router.post('/signin', async (ctx, next) => {
  // passport固定用法，用作登录的方法
  // console.log(123)
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// 发送验证码的方法
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  // 如果发送验证码过于频繁
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '过于频繁'
    }
    return false
  }
  // nodeMailer配置
  let transporter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  // 邮件的配置
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '注册码',
    html: `您在李磊的博客中注册，您的验证码是${ko.code}`
  }
  // 发送验证码
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

// 发送邮箱重置密码验证码的方法
router.post('/emailverify', async (ctx, next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`emailuser:${username}`, 'emailexpire')
  // 如果发送验证码过于频繁
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '请求过于频繁'
    }
    return false
  }
  // nodeMailer配置
  let transporter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  // 邮件的配置
  let mailOptions = {
    from: `"密码重置邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '验证码',
    html: `您在李磊的博客中邮箱重置密码，您的验证码是${ko.code}`
  }
  // 发送验证码
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      Store.hmset(`emailuser:${ko.user}`, 'emailcode', ko.code, 'emailexpire', ko.expire)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送'
  }
})

// 验证邮件修改密码的验证码
router.get('/checkEmailCode', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      username,
      code
    } = req;
    let savecode = await Store.hget(`emailuser:${username}`, 'emailcode');
    // console.log(code)
    // console.log(username)
    // console.log(savecode)
    if (code == savecode) {
      ctx.body = {
        error: 0
      }
    } else {
      ctx.body = {
        error: -1
      }
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

// 邮件修改密码
router.post('/emailResetPassword', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      username,
      password
    } = req;
    // console.log(username)
    // console.log(password)
    let result = await User.updateOne({
      username: username
    }, {
      $set: {
        password: password
      }
    })
    console.log(result)
    ctx.body = {
      error: 0,
      result,
      msg: '修改成功'
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      msg: '修改失败',
      e
    }
  }
})

// 登出方法
router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

// 获取当前username
router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const {
      username,
      email
    } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

// 获取用户信息
router.get('/userInfo', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      username
    } = req;
    let result = await User.findOne({
      username: username
    });
    ctx.body = {
      error: 0,
      result
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e,
      result: {
        email: ''
      }
    }
  }
})

// 获取全部userInfo
router.get('/getAllUserInfo', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      parseInt
    } = Number;
    let page = parseInt((req.page - 1) * req.pagesize);
    let pagesize = parseInt(req.pagesize);
    let result = await User.find({}).skip(page).limit(pagesize);
    let count = await User.countDocuments({});
    ctx.body = {
      error: 0,
      result,
      count
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e,
      // result:{email:''}
    }
  }
})

// admin 留言用户
router.post('/setAdminMessage', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      username,
      userInfotext
    } = req;
    // console.log(username,userInfotext)
    let result2 = await User.updateOne({
      username: username
    }, {
      $set: {
        userInfotext: userInfotext
      }
    })
    ctx.body = {
      error: 0,
      result2
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

// 删除admin 留言用户
router.post('/delAdminMessage', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      username
    } = req;
    let result2 = await User.updateOne({
      username: username
    }, {
      $set: {
        userInfotext: ''
      }
    })
    ctx.body = {
      error: 0,
      result2
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

// 注销用户
router.post('/deluser', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      username,
      avatar,
      userdesc
    } = req;
    let result1 = await User.deleteOne({
      username: username
    })
    let result2 = await frontArticle.deleteMany({
      author: username
    })
    let result3 = await backArticle.deleteMany({
      author: username
    })
    let result4 = await commentconfig.deleteMany({
      author: username
    })
    let result5 = await commentconfig.deleteMany({
      author: username
    })
    let result6 = await comment.deleteMany({
      author: username
    })
    let json = {
      username: username,
      avatar: avatar,
      userdesc: userdesc
    }
    let result7 = await User.updateMany({}, {
      $pull: {
        followeduser: json
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });
    let result8 = await User.updateMany({}, {
      $pull: {
        followeruser: json
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });
    let json2 = {
      user: username
    }
    let result9 = await User.updateMany({}, {
      $pull: {
        favoriteuser: json2
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });
    ctx.body = {
      error: 0
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

// 原密码修改密码
router.post('/setpwd', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      username,
      oldpwd,
      newpwd
    } = req;
    // console.log(oldpwd,newpwd);
    let result = await User.findOne({
      username: username
    })
    // console.log(result)
    if (result.password == oldpwd) {
      let result2 = await User.updateOne({
        username: username
      }, {
        $set: {
          password: newpwd
        }
      })
      // console.log(result2)
      ctx.body = {
        error: 0,
        result2,
        msg: '修改成功'
      }
    } else {
      ctx.body = {
        error: 0,
        msg: '原密码错误'
      }
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      msg: '修改失败',
      e
    }
  }
})

router.post('/setImage', upload.single('file'), async ctx => {
  // let {data:{user}} = await axios.get('bloguser/getUser');
  // console.log(ctx)
  try {
    let user = ctx.request.query.username;
    // let userdesc = ctx.request.query.userdesc;
    // let json = {
    //   username:user,
    //   userdesc:userdesc,
    //   avatar:ctx.req.file.filename
    // }
    // let r = await User.updateMany({followeduser:{username:user}},{$push:{followeduser:json}})
    // let e = await User.updateMany({followedused:{username:user}},{$push:{followedused:json}})

    let result = await User.updateOne({
      username: user
    }, {
      $set: {
        avatar: ctx.req.file.filename
      }
    })
    ctx.body = {
      error: 0,
      filename: ctx.req.file.filename, //返回文件名
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }

})

// router.get('/deleteUserImage', async ctx => {
//   try {
//     let imgname = ctx.request.query.imgname;
//     console.log(imgname)
//     let imgpath = path.resolve(__dirname, '../../public/uploads/'+imgname);
//     console.log(imgpath)
//     // fs.unlinkSync(imgpath);
//     fs.access(imgpath,(err)=>{
//         console.log(err ?  '目录/文件不存在': '文件存在,可以进行读写');
//     });

//     fs.unlink(imgpath,function(e){
//       if(e){
//           console.log(e);
//       }else {
//          console.log('成功')
//       }
//     })
//     ctx.body = {
//       error:0
//     }

//   } catch (e) {
//     ctx.body = {
//       error:-1,
//       meg:'500'
//     }
//   }
// })

router.get('/setuserinfo', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      oldusername,
      newusername,
      userdesc,
      avatar
    } = req;
    let result = await User.updateOne({
      username: oldusername
    }, {
      $set: {
        username: newusername,
        userdesc: userdesc
      }
    })
    // let json = {
    //   username:newusername;

    // }
    ctx.body = {
      error: 0
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

// 获取是否关注
router.get('/followedStatus', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      currentUser,
      followedUser
    } = req;

    let result = await User.findOne({
      username: currentUser
    });
    // console.log(result)
    let isFollowed = false;
    for (let i = 0; i < result.followeduser.length; i++) {
      if (result.followeduser[i].username == followedUser) {
        isFollowed = true;
      } else {
        isFollowed = false;
      }
    }
    ctx.body = {
      error: 0,
      isFollowed
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})


// 添加关注
router.post('/updateFollowedUser', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      currentUser,
      followedUser
    } = req;


    let followedUserJson = await axios.get('/bloguser/userInfo', {
      params: {
        username: followedUser
      }
    })

    let currentUserJson = await axios.get('/bloguser/userInfo', {
      params: {
        username: currentUser
      }
    })
    // console.log(data.result)

    let json = {
      username: followedUserJson.data.result.username,
      avatar: followedUserJson.data.result.avatar,
      userdesc: followedUserJson.data.result.userdesc
    }
    let json2 = {
      username: currentUserJson.data.result.username,
      avatar: currentUserJson.data.result.avatar,
      userdesc: currentUserJson.data.result.userdesc
    }
    // console.log(currentUser)
    // console.log(followedUser)
    let result = await User.findOneAndUpdate({
      username: currentUser,
    }, {
      $push: {
        followeduser: json
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });

    let result2 = await User.findOneAndUpdate({
      username: followedUser,
    }, {
      $push: {
        followeruser: json2
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });

    ctx.body = {
      error: 0,
      // arr
      result,
      result2
    };
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

// 取消关注
router.post('/deleteFollowedUser', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      currentUser,
      followedUser
    } = req;

    let followedUserJson = await axios.get('/bloguser/userInfo', {
      params: {
        username: followedUser
      }
    })

    let currentUserJson = await axios.get('/bloguser/userInfo', {
      params: {
        username: currentUser
      }
    })
    // console.log(data.result)

    let json = {
      username: followedUserJson.data.result.username,
      avatar: followedUserJson.data.result.avatar,
      userdesc: followedUserJson.data.result.userdesc
    }
    let json2 = {
      username: currentUserJson.data.result.username,
      avatar: currentUserJson.data.result.avatar,
      userdesc: currentUserJson.data.result.userdesc
    }
    // console.log(currentUser)
    // console.log(followedUser)
    let result = await User.findOneAndUpdate({
      username: currentUser,
    }, {
      $pull: {
        followeduser: json
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });

    let result2 = await User.findOneAndUpdate({
      username: followedUser,
    }, {
      $pull: {
        followeruser: json2
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });

    ctx.body = {
      error: 0,
      // arr
      result,
      result2
    };
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})

router.get('/getFollow', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      username
    } = req;

    // let result = await User.find({
    //   followeruser: {
    //     $elemMatch: {
    //       user: username
    //     }
    //   }
    // })
    let result = await User.findOne({
      username: username
    })
    // console.log(result)
    // console.log(result.followeruser)
    // console.log(result.followeduser)
    let followers = [];
    let followeds = [];


    for (let i = 0; i < result.followeruser.length; i++) {
      if (i % 2 == 0) {
        followers.push(result.followeruser[i]);
      }
    }
    for (let i = 0; i < result.followeduser.length; i++) {
      if (i % 2 == 0) {
        followeds.push(result.followeduser[i]);
      }
    }
    // console.log(followers)
    // console.log(followeds)
    ctx.body = {
      error: 0,
      result,
      followers,
      followeds
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})


router.get('/allFolloweds', async ctx => {
  try {
    let req = ctx.request.query;
    let json = {
      'username': req.username
    }
    let {
      status,
      data
    } = await axios.get('/bloguser/getFollow', {
      params: json
    })
    // console.log(results )
    if (status == 200) {
      console.log(data.followeds.length)
      if (data.followeds.length == 0) {
        ctx.body = {
          error: 1,
        }
      } else {
        let result = [];

        for (let i = 0; i < data.followeds.length; i++) {
          result.push(data.followeds[i].username)
        }

        ctx.body = {
          error: 0,
          result
        }
      }
    } else {
      ctx.body = {
        error: -1
      }
    }

  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

router.get('/allFollowers', async ctx => {
  try {
    let req = ctx.request.query;
    let json = {
      'username': req.username
    }
    let {
      status,
      data
    } = await axios.get('/bloguser/getFollow', {
      params: json
    })
    // console.log(results )
    if (status == 200) {
      if (data.followers.length == 0) {
        ctx.body = {
          error: 1,
        }
      } else {
        let result = [];

        for (let i = 0; i < data.followers.length; i++) {
          result.push(data.followers[i].username)
        }

        ctx.body = {
          error: 0,
          result
        }
      }
    } else {
      ctx.body = {
        error: -1
      }
    }

  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

export default router
