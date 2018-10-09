import Base from 'common/base.js';
// 文章简介 model
import articleIntroduceModel from 'models/articleIntroduce/articleIntroduce.js';
// 文章详情 model
import articleContentModel from 'models/articleContent/articleContent.js';
// 文章评论
import articleCommentModel from 'models/articleComment/articleComment.js';
// 文章评论的子评论
import articleSubCommentModel from 'models/articleSubComment/articleSubComment.js';
class Deletes extends Base {
  constructor() {
    super();
    this.deleteArticleById = this.deleteArticleById.bind(this);
  }
  /*
   *  删除文件必传参数
   *    username 只有该用户才能删除自己发布的文章
   *    id 需要删除的文章的id
   */
  async deleteArticle (req, res) {

  }
  async deleteArticleById (req, res) {
    let {
      user, // 用户信息详细信息
      body,// 请求参数，usernaem ,id
      articleIntroduce,// 文章的简介
      articleContent, // 文章的详细内容
      comments // 文章的评论
    } = req;
    // 判断用户是否存在
    if (!user) {
      res.send({
        code: 401,
        message: '您没办法这么做，因为您不是我们的用户~',
      })
      return;
    }
    // 获取请求参数
    let {
      username,
      id
    } = body;
    if (!username || !id) {
      res.send({
        code: 403,
        message: '缺少必填项',
      })
      return;
    };
    if (user.username !== username) {
      res.send({
        code: 401,
        message: '文章创建者才能删除该文章哦~',
      });
      return;
    }
    let deleteResult = null;
    try {
      // 文章存在才能删除
      if (articleIntroduce) {
        deleteResult = await articleIntroduceModel.findByIdAndRemove(id);
      };
      if (articleContent) {
        await articleContentModel.findByIdAndRemove(id);
      };
      if (comments) {
        await articleCommentModel.findByIdAndRemove(id);
      };
      res.send({
        code: 200,
        message: '删除成功'
      });
    } catch (e) {
      res.send({
        code: 500,
        message: 'controller/deletes - deleteArticleById 报错了'
      })
    }
  }
  // 通过Id删除评论
  async deleteCommentById (req, res, next) {
    let { user, comments, body } = req;
    // commentId 是数组项即：文章评论的id ，id是文章的id
    let { commentId, id } = body;
    let index = comments.findIndex(item => item.id === commentId);
    // 查找id在评论中的位置，如果不存在，原因是当进行赞操作时，该条评论已经被人删除了
    if (index === -1) {
      res.send({
        code: 404,
        message: '该评论已经被删除了！',
        data: null
      });
      return;
    }
    // 如果进行该操作的用户id != user.id 证明删除操作不是由创建用户发起的，不能删除
    if (comments[index].userId.toString() !== user.id.toString()) {
      res.send({
        code: 401,
        message: '文章创建者才能删除该文章哦~',
      });
      return;
    }
    // 如果该评论有子评论，那么就删除子评论
    if (comments[index].children.length) {
      let removeChilds = await Promise.all(comments[index].children.map(async (id) => {
        return await articleSubCommentModel.findByIdAndRemove(id);
      }))
    }
    // 查找用户名字在赞列表中的位置
    comments.splice(index, 1);
    // 更新评论列表
    let updateResult = await articleCommentModel.update({
      _id: id
    }, {
        comments
      });
    if (updateResult.ok === 1) {
      res.send({
        code:200,
        message:'删除成功！'
      })
    }
  }
  // 删除子评论
  async deleteSubComment (req, res, next) {
    let { user, comments, body } = req;
    // commentId 是数组项即：文章评论的id ，id是文章的id，childId 是子评论的id；
    let { commentId, id, childId } = body;
    let index = comments.findIndex(item => item.id === commentId);
    if (index === -1) {// 查找id在评论中的位置，如果不存在，原因是当进行赞操作时，该条评论已经被人删除了
      res.send({
        code: 404,
        message: '该评论已经被删除了！请刷新后加载最新评论内容',
        data: null
      });
      return;
    };
    let childIdIndex = comments[index].children.findIndex(id => id.toString() === childId.toString());

    if (childIdIndex === -1) {
      res.send({
        code: 404,
        message: '该子评论已经不存在，无法被删除！',
        data: null
      });
      return;
    }
    try {
      // 删除comments中children的childId
      comments[index].children.splice(childIdIndex, 1);
      // 更新comments
      let updateResult = await articleCommentModel.update({
        _id: id
      }, {
          comments
        });
      // 删除成功
      if (updateResult.ok === 1) {
        // 删除子评论(单独的表)
        let deleteResult = await articleSubCommentModel.findByIdAndRemove(childId);
        /* 在这获取删除后的所有评论返回给客户端 */
        res.send({
          code:200,
          message:'删除成功！',
          data:deleteResult
        })
      }
    } catch (e) {

    }
  }
}

export default new Deletes()
