const mongoose = require('mongoose');
// 评论数据库模型
let commentSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  comment: []
});

let commentModel = mongoose.model('comment', commentSchema);

module.exports = commentModel;
