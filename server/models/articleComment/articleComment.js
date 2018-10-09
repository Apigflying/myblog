import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const articleCommentSchema = new Schema({
  _id:String,// 文章的id
  comments: Array // 评论信息
});

const articleCommentModel = mongoose.model('article-comment', articleCommentSchema);

export default articleCommentModel;
