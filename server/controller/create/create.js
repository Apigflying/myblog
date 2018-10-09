// 文章简介 model
import articleIntroduceModel from 'models/articleIntroduce/articleIntroduce.js';
// 文章详情 model
import articleContentModel from 'models/articleContent/articleContent.js';
// 文章评论
import articleCommentModel from 'models/articleComment/articleComment.js';
// 文章评论的子评论
import articleSubCommentModel from 'models/articleSubComment/articleSubComment.js';
import moment from 'moment';
// 获取用户类，create继承它
import userInstance from 'controller/user/user.js';
const User = userInstance.constructor;
class Create extends User {
  constructor() {
    super();
    this.createArticleComment = this.createArticleComment.bind(this);
    this.createSubComment = this.createSubComment.bind(this);
    this.setPraise = this.setPraise.bind(this);
  }
  async createArticleIntroduce (req, res) {
    /*
     *  @params
     *    body { title,introduction,classify }
     *    articleIntroduce 查询数据库，看是否有这个文章，如果有文章存在，调用update更新，如果没有调用create创建文章
     */
    let { user, articleIntroduce, body } = req;
    if (!user) {
      res.send({
        code: 401,
        message: '您没办法这么做，因为您不是我们的用户~',
      })
      return;
    }
    let {
      title,
      introduction,
      imageUrl = 'http://osjykr1v3.bkt.clouddn.com/FsvJiwQsw4ZjPkeSAs7KhMdDVGHk',
      classify,
    } = body;
    if (!title || !introduction) {
      res.send({
        code: 403,
        message: '缺少必填项',
      })
      return;
    };
    // 如果文章简介存在，那么就是修改已有文章简介了
    if (articleIntroduce) {
      // token解析出的username与文章的username不一样，证明不是文章持有者在修改文章，所以不能修改
      if (user.username !== articleIntroduce.username) {
        res.send({
          code: 403,
          message: '您没有权限修改别人的内容哦~~'
        })
        return;
      }
      try {
        let data = await articleIntroduceModel.update({
          _id: articleIntroduce._id
        }, Object.assign(articleIntroduce, body));
        res.send({
          code: 200,
          id: articleIntroduce._id,
          message: '修改内容成功'
        })
      } catch (e) {

      }
      return;
    }
    // 创建时间
    let createTime = moment().valueOf();
    try {
      let data = await articleIntroduceModel.create({
        username: user.username,// 文章的作者
        title, // 标题
        createTime, // 创建日期
        introduction, // 文章内容
        imageUrl, // 文章图片地址
        classify, // 文章分类
      });
      // mongoDB 生成的id
      let id = data._id;
      res.send({
        code: 200,
        id,
        state: 'success',
        message: '创建文章成功！'
      });
    } catch (e) {
      res.send({
        code: 500,
        error: e,
      })
    }
  }
  // 创建文章内容 markDown
  async createArticleContent (req, res) {
    let { user, articleContent, body } = req;
    const { id, text } = body;
    if (!user) {
      res.send({
        code: 401,
        message: '您没办法这么做，因为您不是我们的用户~',
      });
      return;
    }
    // 如果数据库中存在该数据，就更新该数据内容
    if (articleContent) {
      if (user.username !== articleContent.username) {
        res.send({
          code: 403,
          message: '您没有权限修改别人的内容哦~~'
        })
        return;
      }
      try {
        let data = await articleContentModel.update({
          _id: id
        }, Object.assign(articleContent, {
          // username:user.username,
          articleContent: text, // 文章内容
        }));
        res.send({
          code: 200,
          state: 'success',
          message: '修改内容成功'
        })
      } catch (e) {

      }
      return;
    }
    try {
      let data = await articleContentModel.create({
        _id: id,// 文章的id
        username: user.username,// 文章的作者
        articleContent: text, // 文章内容
        state: '', // 状态
        comment: [], // 评论信息
        browse: 0 // 浏览次数
      });
      res.send({
        code: 200,
        state: 'success',
        message: '创建文章成功！'
      })
    } catch (e) {

    }
  }
  // 创建文章评论
  async createArticleComment (req, res) {
    // 创建评论的时间
    let createTime = moment().valueOf();
    /*
      user 用户的详细信息
      body 请求体内容
      comments 获取评论，用于给评论添加id
    */
    let { user, body, comments } = req;
    let data = null, message = '', id = 1;
    if (!!comments && comments.length) {
      id = comments[comments.length - 1].id + 1;
    }
    // 保存到评论列表中的评论项
    const commentItem = {
      id, // 评论id
      userId: user.id, // 评论的用户id
      comment: body.comment, // 评论内容
      createTime,
      praise: [],// 赞列表
      children: [] // 子评论
    };
    try {
      let commentList = comments || [];
      commentList.push(commentItem);
      if (comments) {
        // 如果评论已经存在，更新
        let updateResult = await articleCommentModel.update({
          _id: body.id
        }, {
            comments: commentList
          });
        if (updateResult.ok === 1) {
          message = '添加评论成功！';
        }
      } else {
        // 如果评论不存在，创建评论
        let result = await articleCommentModel.create({
          _id: body.id,
          comments: commentList
        });
        if (result.comments) {
          message = '恭喜您抢占沙发！';
        }
      };
      let userInfo = await this.findUserInfoById(commentItem.userId);
      let commentItemDetail = Object.assign({},commentItem,{
        userName:userInfo.username,
        userPic:userInfo.picture,
      });
      res.send({
        code: 200,
        data: commentItemDetail,
        message
      })
    } catch (e) {
      res.send({
        code: 500,
        message: 'createArticleComment 报错500'
      })
    }
  }
  // 创建子评论
  async createSubComment (req, res, next) {
    let createTime = moment().valueOf();
    /*
      user 读取的当前登录用户的信息(详细信息 )
      body 提交的内容
        参数
          id - 文章id，通过id获取comments列表
          commentId - 父评论的id
          comments - 子评论的评论内容
          replyUserId - 回复对象的用户id
      comments 获的评论列表
    */
    let { user, body, comments } = req;
    try {
      if (comments && comments.length) {
        // 通过id匹配父评论
        let commentItem = comments.find(item => item.id === body.commentId);
        if (!!commentItem) {
          // 如果父评论存在，创建子评论
          let data = await articleSubCommentModel.create({
            userId: user.id,
            comments: body.comments,
            replyUserId: body.replyUserId || '',// 非必传项
            createTime
          });
          // 创建文章成功会返回创建的文章的数据
          // 添加完子评论之后，将创建的子评论id存放到父评论列表
          commentItem.children.push(data._id);
          // 更新评论列表，实际是更新里面的children
          await articleCommentModel.update({
            _id: body.id
          }, {
              comments
            });
          // 通过children中的id查找所有子评论
          let result = await Promise.all(commentItem.children.map(async (id) => {
            let subComment = await articleSubCommentModel.findById(id);
            let userMes = await this.findUserInfoById(subComment.userId);
            if (!!subComment.replyUserId) {
              // 获取回复对象的信息
              let replyUserMes = await this.findUserInfoById(subComment.replyUserId);
              return Object.assign({}, {
                id,
                createTime: subComment.createTime,
                comments: subComment.comments,
              }, {
                  userId: userMes._id,
                  userName: userMes.username,
                  userPic: userMes.picture
                }, {
                  replyUserId: replyUserMes._id,
                  replyName: replyUserMes.username,
                  replyPic: replyUserMes.picture
                })
            }
            return Object.assign({}, {
              id,
              createTime: subComment.createTime,
              comments: subComment.comments,
            }, {
                userId: userMes._id,
                userName: userMes.username,
                userPic: userMes.picture
              });
          }));
          res.send({
            code: 200,
            data: result,
            message: '查找成功'
          })
        } else {
          // 父评论已经被删除了
          res.send({
            code: 404,
            message: '该评论已经被删除了，您无法添加评论了！'
          })
        }
      }
    } catch (e) {

    }
  }
  // 给点赞和取消点赞
  async setPraise (req, res) {
    let { comments, body, user } = req;
    let { commentId, id } = body;
    let index = comments.findIndex(item => item.id === commentId);
    if (index === -1) {// 查找id在评论中的位置，如果不存在，原因是当进行赞操作时，该条评论已经被人删除了
      res.send({
        code: 404,
        message: '该评论已经被作者删除了！',
        data: null
      });
      return;
    }
    // 查找用户名字在赞列表中的位置
    let praiseIndex = comments[index].praise.indexOf(user.username);
    // 如果赞列表中没有这个名字
    if (praiseIndex === -1) {
      comments[index].praise.push(user.username);
    } else {
      comments[index].praise.splice(praiseIndex, 1);
    }
    let updateResult = await articleCommentModel.update({
      _id: id
    }, {
        comments
      });
    if (updateResult.ok === 1) {
      res.send({
        code: 200,
        praise: comments[index].praise,
        message:'操作成功！'
      })
    }
  }
}

export default new Create()
