import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const articleSubCommentSchema = new Schema({
  userId:String,// 创建评论的用户的id
  comments:String,// 评论内容
  replyUserId:{type:String,default:''},// 回复的用户的id
  createTime:String,// 创建时间
});

const articleSubCommentModel = mongoose.model('article-sub-comment', articleSubCommentSchema);

export default articleSubCommentModel;
