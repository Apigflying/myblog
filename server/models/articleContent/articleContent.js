import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const articleContentSchema = new Schema({
  _id:String,// 文章的id
  username:String,// 文章的作者
	articleContent: String, // 文章内容
	state: String, // 状态
  comment: Array, // 评论信息
  browse:Number // 浏览次数
});

const articleContentModel = mongoose.model('article-content', articleContentSchema);

export default articleContentModel;
