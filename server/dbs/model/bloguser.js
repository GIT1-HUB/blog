const mongoose = require('mongoose');
// 用户数据库模型
let userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  followeduser: [],
  followeruser: [],
  avatar:String,
  userdesc:String,
  userInfotext:String
});

let usersModel = mongoose.model('bloguser', userSchema);

module.exports = usersModel;
