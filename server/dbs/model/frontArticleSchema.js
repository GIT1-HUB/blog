import mongoose from 'mongoose'
const Schema = mongoose.Schema
// 前端文章数据库模型
const articleSchema = new Schema({
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
  imgFileName: String,
  comment: [],
  favorite: [],
  like: [],
  topstatus:Boolean
})

export default mongoose.model('frontArticle', articleSchema)
