import Router from 'koa-router';
import axios from './utils/axios'
import frontArticle from '../dbs/model/frontArticleSchema'
import comment from '../dbs/model/commentSchema'
import backArticle from '../dbs/model/backArticleSchema'
import path from 'path'
import fs from 'fs'
import {
  Back
} from 'gsap';

const multer = require('koa-multer'); //加载koa-multer模块
//文件上传
//配置
var storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/banner/')
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
  prefix: '/article'
})

// 排序方法
function compare(property) {
  return function (a, b) {
    var value1 = new Date(a[property].replace(/年/g, '/').replace(/月/g, '/').replace(/日/g, ''));
    var value2 = new Date(b[property].replace(/年/g, '/').replace(/月/g, '/').replace(/日/g, ''));
    // console.log(value1)
    // console.log(value2)
    return value2.getTime() - value1.getTime();
  }
}

function compare2(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    // console.log(value1)
    // console.log(value2)
    return value2 - value1;
  }
}

// 添加文章
router.post('/insertArticle', async ctx => {
  try {
    let req = ctx.request.body;
    // console.log(123413);
    let {
      title,
      htmlContent,
      date,
      des,
      original,
      radio,
      author
    } = req;
    // let db = radio = 'Front' ? 'frontArticle' : 'backArticle';
    if (radio == 'Front') {
      var result = await frontArticle.create({
        title,
        content: htmlContent,
        time: date,
        des,
        original,
        list: radio,
        author,
        readnumber: 0
      })
    } else {
      var result = await backArticle.create({
        title,
        content: htmlContent,
        time: date,
        des,
        original,
        list: radio,
        author,
        readnumber: 0
      })
    }
    // console.log(db)
    // const front = await db.update({title},{$set:{title,content:htmlContent,time:date,des,original,list:radio}},{upsert:true});
    // console.log(result)
    ctx.body = {
      error: 0,
      success: result
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      info: e
    }
  }
})

// 获取前端文章
router.get('/getFrontArticle', async ctx => {
  try {
    let req = ctx.request.query;
    let page = parseInt((req.page - 1) * req.pagesize);
    let pagesize = parseInt(req.pagesize);
    // console.log(page);
    let list = await frontArticle.find({}, {
      __v: 0,
      content: 0,
      original: 0,
    }).skip(page).limit(pagesize)
    let count = await frontArticle.countDocuments({});
    ctx.body = {
      error: 0,
      count,
      list
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      info: e
    }
  }
})

// 根据作者获取文章列表
router.get('/frontList', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      parseInt
    } = Number;
    let page = parseInt((req.page - 1) * req.pagesize);
    let pagesize = parseInt(req.pagesize);
    let author = req.author;
    // console.log(author)
    let front = await frontArticle.find({
      author: author
    }, {
      __v: 0,
      content: 0,
      original: 0
    }).skip(page).limit(pagesize).sort({
      '_id': -1
    });
    let frontCount = await frontArticle.countDocuments({
      author: author
    });
    ctx.body = {
      error: 0,
      count: frontCount,
      front
    }
  } catch (e) {
    //handle error
    ctx.body = {
      error: 1,
      info: e
    }
  }
})


// 根据作者获取文章列表
router.get('/backList', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      parseInt
    } = Number;
    let page = parseInt((req.page - 1) * req.pagesize);
    let pagesize = parseInt(req.pagesize);
    let author = req.author;
    // console.log(author)
    let back = await backArticle.find({
      author: author
    }, {
      __v: 0,
      content: 0,
      original: 0
    }).skip(page).limit(pagesize).sort({
      '_id': -1
    });
    let backCount = await backArticle.countDocuments({
      author: author
    });
    ctx.body = {
      error: 0,
      count: backCount,
      back
    }
  } catch (e) {
    //handle error
    ctx.body = {
      error: 1,
      info: e
    }
  }
})

// 根据作者获取全部文章
router.get('/getAllListByAuthor', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      parseInt
    } = Number;
    let pageStart = parseInt((req.page - 1) * req.pagesize);
    let pageEnd = parseInt((req.page) * req.pagesize);
    let author = req.author;
    // console.log(author)
    let front = await frontArticle.find({
      author: author
    }, {
      __v: 0,
      content: 0,
      original: 0
    })
    let back = await backArticle.find({
      author: author
    }, {
      __v: 0,
      content: 0,
      original: 0
    });

    let frontCount = await frontArticle.countDocuments({
      author: author
    });
    let backCount = await backArticle.countDocuments({
      author: author
    });

    let count = frontCount + backCount;
    let result = front.concat(back).sort(compare2('readnumber'))
    let list = result.slice(pageStart, pageEnd)
    let readmore = result.slice(0, 5);
    // console.log(readmore)
    ctx.body = {
      error: 0,
      count,
      list,
      readmore
    }
  } catch (e) {
    //handle error
    ctx.body = {
      error: 1,
      info: e
    }
  }
})



// 获取后端文章
router.get('/getBackArticle', async ctx => {
  try {
    let req = ctx.request.query;
    let page = parseInt((req.page - 1) * req.pagesize);
    let pagesize = parseInt(req.pagesize);
    // console.log(page);
    let list = await backArticle.find({}, {
      __v: 0,
      content: 0,
      original: 0,
    }).skip(page).limit(pagesize)
    let count = await backArticle.countDocuments({});
    ctx.body = {
      error: 0,
      count,
      list
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      info: e
    }
  }
})

// 根据文章id 回去文章内容
router.get('/articleInfo', async ctx => {
  try {
    let req = ctx.request.query;
    let id = req.id
    // console.log(id);
    let result1 = await frontArticle.find({
      _id: id
    })
    let result2 = await backArticle.find({
      _id: id
    })
    let result = Object.assign(result1, result2)
    ctx.body = {
      error: 0,
      info: result
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      info: e
    }
  }
})

// 获取全部文章
router.get('/getAllArticle', async ctx => {
  try {
    let req = ctx.request.query;
    let pageStart = parseInt((req.page - 1) * req.pagesize);
    let pageEnd = parseInt((req.page) * req.pagesize);
    let result1 = await frontArticle.find({})
    let result2 = await backArticle.find({})

    let result = result1.concat(result2).sort(compare('time'));
    let lately = result.slice(0, 4);
    result.forEach((item, index, arr) => {
      if (item.topstatus) {
        arr.splice(index, 1);
        arr.unshift(item)
      }
    });
    let list = result.slice(pageStart, pageEnd)
    // let result3 = result
    ctx.body = {
      error: 0,
      count: result.length,
      list,
      lately
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      info: e
    }
  }
})

// 根据id和文章类型删除文章
router.post('/delArticle', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      id,
      list
    } = req;
    let db = list == 'front' ? frontArticle : backArticle;
    // console.log(db)
    let res = await db.deleteOne({
      _id: id
    });
    let res2 = await comment.deleteOne({
      id: id
    })
    let {
      n,
      ok
    } = res;
    ctx.body = {
      del: n,
      ok
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      info: e
    };
  }
})

// 在更新文章页面根据id获取文章内容
router.get('/updateArticle', async ctx => {
  let {
    id
  } = ctx.request.query;
  try {
    // let res = frontArticle.findByIdAndUpdate({_id:id},{$})
    let front = await frontArticle.find({
      _id: id
    });
    let back = await backArticle.find({
      _id: id
    });
    let arr = [...front, ...back];
    ctx.body = {
      arr
    };
  } catch (e) {
    //handle error
    ctx.body = e;
  }
})

router.get('/deleteBannerImage', async ctx => {
  try {
    let imgname = ctx.request.query.imgname;
    // console.log(imgname)
    // let imgpath = path.resolve(__dirname, '../../public/uploads/'+imgname);
    let imgpath = path.resolve(__dirname, '../../public/banner/' + imgname);
    // console.log(imgpath)
    // fs.unlinkSync(imgpath);
    fs.access(imgpath, (err) => {
      console.log(err ? '目录/文件不存在' : '文件存在,可以进行读写');
    });

    fs.unlink(imgpath, function (e) {
      if (e) {
        console.log(e);
      } else {
        console.log('成功')
      }
    })
    ctx.body = {
      error: 0
    }

  } catch (e) {
    ctx.body = {
      error: -1,
      meg: '500'
    }
  }
})

// 上传banner图
router.post('/setBannerImage', upload.single('file'), async ctx => {
  try {
    let id = ctx.request.query.id;
    let type = ctx.request.query.type;
    if (type == 'Front') {
      let result1 = await frontArticle.updateOne({
        _id: id
      }, {
        $set: {
          imgFileName: ctx.req.file.filename
        }
      })
    } else {
      let result2 = await backArticle.updateOne({
        _id: id
      }, {
        $set: {
          imgFileName: ctx.req.file.filename
        }
      })
    }
    // console.log(path.resolve(__dirname, '../../public/uploads/'+ctx.req.file.filename))
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

// 根据id更新文章
router.post('/update', async ctx => {
  try {
    let req = ctx.request.body;
    // console.log(req)
    let {
      title,
      content,
      date,
      des,
      original,
      list,
      id
    } = req;
    // console.log(id)
    let front = await frontArticle.findByIdAndUpdate({
      _id: id
    }, {
      $set: {
        title,
        content,
        time: date,
        des,
        original,
        list
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });
    let back = await backArticle.findByIdAndUpdate({
      _id: id
    }, {
      $set: {
        title,
        content,
        time: date,
        des,
        original,
        list
      }
    }, function (err, res) {
      if (err) {
        console.log("bError:" + err);
      } else {
        return res
      }
    });
    // console.log(front)
    // console.log(arr)
    ctx.body = {
      error: 0
      // arr
    };
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    };
  }
})

// 根据作者查询前端文章
router.get('/searchFrontArticleListByAuthor', async ctx => {
  try {
    let searcharticle = ctx.request.query.searcharticle;
    let author = ctx.request.query.author;
    let strReg = eval('/' + searcharticle + '/');
    let list = await frontArticle.find({
      author: author,
      $or: [{
        title: strReg
      }, {
        original: strReg
      }, {
        des: strReg
      }]
    });
    ctx.body = {
      error: 0,
      list,
      count: list.length
    }
  } catch (error) {
    ctx.body = error
  }
})
// 根据作者查询后端文章
router.get('/searchBackArticleListByAuthor', async ctx => {
  try {
    let searcharticle = ctx.request.query.searcharticle;
    let author = ctx.request.query.author;
    let strReg = eval('/' + searcharticle + '/');
    let list = await backArticle.find({
      author: author,
      $or: [{
        title: strReg
      }, {
        original: strReg
      }, {
        des: strReg
      }]
    });
    ctx.body = {
      error: 0,
      list,
      count: list.length
    }
  } catch (error) {
    ctx.body = error
  }
})

// 查询前端文章
router.get('/searchFrontArticleList', async ctx => {
  try {
    let searcharticle = ctx.request.query.searcharticle;
    let strReg = eval('/' + searcharticle + '/');
    let list = await frontArticle.find({
      $or: [{
        title: strReg
      }, {
        original: strReg
      }, {
        des: strReg
      }]
    });
    ctx.body = {
      error: 0,
      list,
      count: list.length
    }
  } catch (error) {
    ctx.body = error
  }
})
// 查询后端文章
router.get('/searchBackArticleList', async ctx => {
  try {
    let searcharticle = ctx.request.query.searcharticle;
    let strReg = eval('/' + searcharticle + '/');
    let list = await backArticle.find({
      $or: [{
        title: strReg
      }, {
        original: strReg
      }, {
        des: strReg
      }]
    });
    ctx.body = {
      error: 0,
      list,
      count: list.length
    }
  } catch (error) {
    ctx.body = error
  }
})

// 根据作者查询全部文章
router.get('/searchArticleList', async ctx => {
  try {
    let searcharticle = ctx.request.query.searcharticle;
    let strReg = eval('/' + searcharticle + '/');
    let list1 = await frontArticle.find({
      $or: [{
        title: strReg
      }, {
        original: strReg
      }, {
        des: strReg
      }]
    });
    let list2 = await backArticle.find({
      $or: [{
        title: strReg
      }, {
        original: strReg
      }, {
        des: strReg
      }]
    });
    let list = list1.concat(list2)
    ctx.body = {
      error: 0,
      list,
      count: list.length
    }
  } catch (error) {
    ctx.body = error
  }
})

// 浏览一次文章增加一个阅读次数
router.get('/updateReadNumber', async ctx => {
  try {
    let req = ctx.request.query;
    let id = req.id;
    let number = req.number;
    let front = await frontArticle.findByIdAndUpdate({
      _id: id
    }, {
      $set: {
        readnumber: number
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });
    let back = await backArticle.findByIdAndUpdate({
      _id: id
    }, {
      $set: {
        readnumber: number
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
      // arr
    };
  } catch (e) {
    ctx.body = {
      error: -1,
      e
    };
  }

})

// 根据id和用户获取是否点赞
router.get('/likeStatus', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      id,
      user
    } = req;
    let front = await frontArticle.findOne({
      _id: id
    })
    let back = await backArticle.findOne({
      _id: id
    })
    let result;
    if (front == null) {
      result = back
    } else {
      result = front
    }

    let state = false;
    let count = result.like.length;
    for (let i = 0; i < count; i++) {
      if (result.like[i].user == user) {
        state = true;
      }
    }

    ctx.body = {
      error: 0,
      state,
      count
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})

// 添加点赞
router.post('/updateLike', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      id,
      user
    } = req;

    let json = {
      user: user
    }
    let front = await frontArticle.findByIdAndUpdate({
      _id: id,
    }, {
      $push: {
        like: json
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });

    let back = await backArticle.findByIdAndUpdate({
      _id: id,
    }, {
      $push: {
        like: json
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
      // arr
    };
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})

// 取消点赞
router.post('/deleteLike', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      id,
      user
    } = req;
    let json = {
      user: user
    }
    let front = await frontArticle.findByIdAndUpdate({
      _id: id,
    }, {
      $pull: {
        like: json
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });

    let back = await backArticle.findByIdAndUpdate({
      _id: id,
    }, {
      $pull: {
        like: json
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
      // arr
    };
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})

// 获取点赞过的文章
router.get('/getLikeArticle', async ctx => {
  try {
    let req = ctx.request.query;
    let user = req.user
    let pageStart = parseInt((req.page - 1) * req.pagesize);
    let pageEnd = parseInt((req.page) * req.pagesize);
    // console.log(user)
    // console.log(pageStart)
    // console.log(pageEnd)
    let front = await frontArticle.find({
      like: {
        $elemMatch: {
          user: user
        }
      }
    })
    let back = await backArticle.find({
      like: {
        $elemMatch: {
          user: user
        }
      }
    })
    let count = front.length + back.length;
    let result = front.concat(back).sort(compare2('readnumber'))
    let list = result.slice(pageStart, pageEnd)

    // console.log(front)
    // console.log(back)
    ctx.body = {
      error: 0,
      list,
      count
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})



// 获取收藏状态
router.get('/favoriteStatus', async ctx => {
  try {
    let req = ctx.request.query;
    let {
      id,
      user
    } = req;
    let front = await frontArticle.findOne({
      _id: id
    })
    let back = await backArticle.findOne({
      _id: id
    })
    let result;
    if (front == null) {
      result = back
    } else {
      result = front
    }

    let state = false;
    let count = result.favorite.length;
    for (let i = 0; i < count; i++) {
      if (result.favorite[i].user == user) {
        state = true;
      }
    }

    ctx.body = {
      error: 0,
      state,
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})

// 添加收藏
router.post('/updateFavorite', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      id,
      user
    } = req;

    let json = {
      user: user
    }
    let front = await frontArticle.findByIdAndUpdate({
      _id: id,
    }, {
      $push: {
        favorite: json
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });

    let back = await backArticle.findByIdAndUpdate({
      _id: id,
    }, {
      $push: {
        favorite: json
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
      // arr
    };
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})

// 取消收藏
router.post('/deleteFavorite', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      id,
      user
    } = req;
    let json = {
      user: user
    }
    let front = await frontArticle.findByIdAndUpdate({
      _id: id,
    }, {
      $pull: {
        favorite: json
      }
    }, function (err, res) {
      if (err) {
        console.log("fError:" + err);
      } else {
        return res
      }
    });

    let back = await backArticle.findByIdAndUpdate({
      _id: id,
    }, {
      $pull: {
        favorite: json
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
      // arr
    };
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})

// 获取收藏文章
router.get('/getFavoriteArticle', async ctx => {
  try {
    let req = ctx.request.query;
    let user = req.user
    let pageStart = parseInt((req.page - 1) * req.pagesize);
    let pageEnd = parseInt((req.page) * req.pagesize);
    // console.log(user)
    // console.log(pageStart)
    // console.log(pageEnd)
    let front = await frontArticle.find({
      favorite: {
        $elemMatch: {
          user: user
        }
      }
    })
    let back = await backArticle.find({
      favorite: {
        $elemMatch: {
          user: user
        }
      }
    })
    let count = front.length + back.length;
    let result = front.concat(back).sort(compare2('readnumber'))
    let list = result.slice(pageStart, pageEnd)

    // console.log(front)
    // console.log(back)
    ctx.body = {
      error: 0,
      list,
      count
    }
  } catch (e) {
    ctx.body = {
      error: 1,
      e
    }
  }
})


// 根据id置顶文章
router.post('/setTopById', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      id,
      list
    } = req;
    // console.log(id,list)
    if (list == "front") {
      let result = await frontArticle.updateOne({
        _id: id
      }, {
        topstatus: true
      }, {
        upsert: true
      })
    } else if (list == "back") {
      let result = await backArticle.updateOne({
        _id: id
      }, {
        topstatus: true
      }, {
        upsert: true
      })
    }
    ctx.body = {
      error: 0
    }
  } catch (e) {
    ctx.body = {
      e,
      error: -1
    }
  }
})

// 根据id取消置顶文章
router.post('/deleteTopById', async ctx => {
  try {
    let req = ctx.request.body;
    let {
      id,
      list
    } = req;
    // console.log(id,list)
    if (list == "front") {
      let result = await frontArticle.updateOne({
        _id: id
      }, {
        topstatus: false
      }, {
        upsert: true
      })
    } else if (list == "back") {
      let result = await backArticle.updateOne({
        _id: id
      }, {
        topstatus: false
      }, {
        upsert: true
      })
    }
    ctx.body = {
      error: 0
    }
  } catch (e) {
    ctx.body = {
      e,
      error: -1
    }
  }
})
export default router
