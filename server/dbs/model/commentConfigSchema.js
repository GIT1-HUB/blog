const mongoose = require('mongoose');
// 评论设置数据库模型
let configSchema = new mongoose.Schema({
  // author: [],
  author: String,
  status: Boolean
});

let configModel = mongoose.model('commentConfig', configSchema);

module.exports = configModel;
