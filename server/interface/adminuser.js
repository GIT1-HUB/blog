import Router from 'koa-router'
import nodeMailer from 'nodemailer'
import User from '../dbs/model/bloguser'
import Admin from '../dbs/model/admin'
import Email from '../dbs/config'
import axios from './utils/axios'
const os = require('os');

let router = new Router({
  prefix: '/adminuser'
})

router.post('/feedback', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      username,
      content
    } = req;
    let user = await User.find({
      username
    })
    // console.log(user)
    // console.log(content)
    let json = {
      username,
      content,
      email: user[0].email
    }
    let result = await Admin.findOneAndUpdate({
      username: 'admin'
    }, {
      $push: {
        feedback: json
      }
    })
    ctx.body = {
      error: 0,
      result
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

router.post('/adminsignin', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      username,
      password
    } = req;
    let result = await Admin.findOne({
      username: username,
      password: password
    })
    // console.log(result)
    if (result) {
      ctx.body = {
        error: 0,
        msg: '登录成功'
      }
    } else {
      ctx.body = {
        error: -1,
        msg: '密码或者用户名出错'
      }
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      msg: '服务器出错'
    }
  }

})


router.get('/getfeedback', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      parseInt
    } = Number;
    let pageStart = parseInt((req.page - 1) * req.pagesize);
    let pageEnd = parseInt((req.page) * req.pagesize);
    // console.log(pageStart,pageEnd)
    let result = await Admin.findOne({
      username: 'admin'
    });
    // console.log(result.feedback)
    let feedback = result.feedback.slice(pageStart, pageEnd)
    let count = result.feedback.length;
    // console.log(feedback)
    // console.log(count)
    ctx.body = {
      error: 0,
      count,
      feedback
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

router.post('/delFeedBack', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      username,
      content,
      email
    } = req;
    let json = {
      username,
      content,
      email
    }
    let result = await Admin.updateOne({
      username: 'admin'
    }, {
      $pull: {
        feedback: json
      }
    })
    ctx.body = {
      result,
      error: 0
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})



router.get('/sendfeedbackemail', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      username,
      content,
      email,
      feedbacktext
    } = req;

    // console.log(req)

    let transporter = nodeMailer.createTransport({
      service: 'qq',
      auth: {
        user: Email.smtp.user,
        pass: Email.smtp.pass
      }
    })
    // 邮件的配置
    let mailOptions = {
      from: `"李磊博客留言回复邮件" <${Email.smtp.user}>`,
      to: email,
      subject: '邮件回复',
      html: `亲爱的<strong>${username}</strong>,您在李磊的博客中留言：<br />&nbsp;&nbsp;${content}，<br />我们的回复:<br />&nbsp;&nbsp;${feedbacktext}`
    }
    // 发送验证码
    await transporter.sendMail(mailOptions, (e, info) => {
      if (e) {
        console.log(e)
        return
      } else {
        console.log('success')
      }
    })
    ctx.body = {
      error: 0,
      msg: '回复成功'
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})
router.post('/system', async ctx => {
  try {
    let {
      parseInt
    } = Number;
    let {
      freemem,
      cpus,
      hostname,
      platform,
      release,
      totalmem,
      type,
      constants
    } = os;
    let total = parseInt(totalmem() / 1024 / 1024);
    let num = parseInt(freemem() / 1024 / 1024);
    let percentage = parseInt((num / total) * 100);
    ctx.body = {
      hostname: hostname(),
      platform: platform(),
      release: release(),
      percentage,
      type: type(),
      totalmem: `${total}MB`,
      freemem: `${num}MB`,
      constants: constants.SIGTRAP ? '1' : '0',
      cpu: cpus()
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})


router.post('/insertLink', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      name,
      address
    } = req;
    let json = {
      name: name,
      address: address
    }
    let result = await Admin.findOneAndUpdate({
      username: 'admin'
    }, {
      $push: {
        link: json
      }
    })
    ctx.body = {
      error: 0,
      result
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

router.post('/delLink', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      name,
      address
    } = req;
    let json = {
      name: name,
      address: address
    }
    let result = await Admin.findOneAndUpdate({
      username: 'admin'
    }, {
      $pull: {
        link: json
      }
    })
    ctx.body = {
      error: 0,
      result
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

router.get('/getLink', async ctx => {
  try {
    let result = await Admin.findOne({
      username: 'admin'
    });
    ctx.body = {
      error: 0,
      link: result.link
    }
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    }
  }
})

export default router
