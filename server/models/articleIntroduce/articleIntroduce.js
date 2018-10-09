import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const articleIntroducteSchema = new Schema({
  username:String,// 文章的作者
  title: String, // 标题
	createTime: Number, // 创建日期
  introduction: String, // 文章内容
  imageUrl:String, // 图片地址
  classify:String, // 文章分类
});

const articleIntroducteModel = mongoose.model('article-introducte', articleIntroducteSchema);

export default articleIntroducteModel;
