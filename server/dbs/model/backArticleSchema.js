const mongoose = require('mongoose');
// 后端文章数据库模型
let articleSchema = new mongoose.Schema({
  title: String,
  time: String,
  content: String,
  original: String,
  des: String,
  list: String,
  author: String,
  readnumber: {
    type: Number,
    default: 0
  },
  like: [],
  favorite: [],
  banner: String,
  imgFileName: String,
  topstatus:Boolean
});

let articleModel = mongoose.model('backArticle', articleSchema);

module.exports = articleModel;
