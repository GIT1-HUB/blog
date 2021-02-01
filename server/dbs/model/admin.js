const mongoose = require('mongoose');
// 用户数据库模型
let adminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  feedback:[],
  link:[]
});

let adminModel = mongoose.model('admin', adminSchema);

module.exports = adminModel;
