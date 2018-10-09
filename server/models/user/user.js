import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,// 用户名
  password: String, // 密码
  picture:String, // 头像图片
  individualitySignature:{type:String,default:''},// 个性签名
  introduce:{type: String,default:''}, // 自我介绍
  createtime: {type: Number},// 用户创建时间
  authlist: {type:Array,default:[]}, // 权限列表
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
