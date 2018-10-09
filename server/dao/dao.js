import UserModel from 'models/user/user.js';
// 文章简介 model
import articleIntroduceModel from 'models/articleIntroduce/articleIntroduce.js';
// 文章详情 model
import articleContentModel from 'models/articleContent/articleContent.js'
// 文章评论
import articleCommentModel from 'models/articleComment/articleComment.js';
// 文章评论的子评论
import articleSubCommentModel from 'models/articleSubComment/articleSubComment.js';
import Base from 'common/base.js';
class Dao extends Base {
  constructor() {
    super();
    this.verifyTokenBase = this.verifyTokenBase.bind(this);
  }
  // 通过用户id查找用户信息
  async findUserInfoById (id) {
    return await UserModel.findById(id);
  }
  // 通过userid更新用户信息
  async updateUserMessage (id, data) {
    return await UserModel.findByIdAndUpdate(id, data);
  }
  // 通过用户名查找用户信息
  async findUserInfoByUserName (username) {
    return await UserModel.findOne({
      username
    });
  }
  // 通过token获取用户信息(username ,password,code)
  verifyToken (token) {
    if (token) {
      // 验证token的正确性
      return this.verifyTokenBase(token);
    } else {
      return {
        code: 400,
        message: 'token不存在！'
      }
    }
  }
}
export default new Dao();
