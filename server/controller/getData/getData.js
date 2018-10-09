// 文章简介 model
import articleIntroduceModel from 'models/articleIntroduce/articleIntroduce.js';
// 文章详情 model
import articleContentModel from 'models/articleContent/articleContent.js'
// 文章评论
import articleCommentModel from 'models/articleComment/articleComment.js';
// 文章评论的子评论
import articleSubCommentModel from 'models/articleSubComment/articleSubComment.js';
// 拿到的是实例
import userInstance from 'controller/user/user.js';
import dao from 'dao/dao.js';
// es6只能继承class 不能继承实例
const User = userInstance.constructor;
class getDataController extends User {
  constructor() {
    super();
    this.getUploadToken = this.getUploadToken.bind(this);
    this.getArticleCommentById = this.getArticleCommentById.bind(this);
    this.getSubCommentById = this.getSubCommentById.bind(this);
  }
  // 获取七牛云上传所需的key和token
  getUploadToken (req, res) {
    let data = this.createQNToken();
    res.send(data);
  }
  // 获取文章简介
  async getArticleList (req, res) {
    const token = req.headers.authorization;
    // query 可通过关键字搜索 - 功能待完善
    let { page = 1, size = 4, search = '' } = req.query;
    let pages = page - 1;
    let sizes = Number(size);
    let searchs = String(search);
    // 通过query搜索数据库
    try {
      let { code } = dao.verifyToken(token);
      let list = await articleIntroduceModel.find();
      if (searchs) {
        list = list.filter(item => {
          let flag = item.introduction.includes(searchs) || item.title.includes(searchs);
          return flag;
        })
      };
      let data = list.sort((a, b) => (b.createTime - a.createTime)).slice(pages * sizes, pages * sizes + sizes);
      res.send({
        code: 200,
        list: data,
        isTokenCanUse: code === 200,
        len: list.length
      });
    } catch (e) {
      res.send({
        code: 500,
        data: e,
        message: '获取文章信息失败了，getArticleList'
      })
    };
  }
  // 通过id获取文章详细内容
  async getArticleById (req, res) {
    try {
      let { articleIntroduce = null, articleContent = null } = req;
      if (articleIntroduce || articleIntroduce) {
        res.send({
          code: 200,
          data: {
            articleIntroduce,
            articleContent,
          }
        })
      } else {
        res.send({
          code: 404,
          data: null
        })
      }
    } catch (e) {
      res.send({
        code: 404,
        data: null
      })
    }
  }
  // 通过id获取文章简介
  async findArticleIntroduceById (req, res, next) {
    // get请求从query中，post请求从body中拿id
    let { id } = req.query.id ? req.query : req.body;
    if (id) {
      try {
        // 通过id查询到的数据库中的数据
        req.articleIntroduce = await articleIntroduceModel.findById(id);
        next();
      } catch (e) {
        res.send({
          error: e,
          code: 500
        })
      }
    } else {
      req.articleIntroduce = null;
      next();
    }
  }
  // 通过id获取文章内容
  async findArticleContentById (req, res, next) {
    // get请求从query中，post请求从body中拿id
    let { id } = req.query.id ? req.query : req.body;
    if (id) {
      try {
        // 通过id查询到的数据库中的数据
        req.articleContent = await articleContentModel.findById(id);
        next();
      } catch (e) {
        res.send({
          error: e,
          code: 500
        })
      }
    } else {
      req.articleContent = null;
      next();
    }
  }
  // 通过id获取文章评论
  async findArticleCommentById (req, res, next) {
    let { id } = req.query.id ? req.query : req.body;
    try {
      let commentList = await articleCommentModel.findById(id);
      let introduce = await articleIntroduceModel.findById(id);
      if (!!introduce) {
        req.comments = commentList ? commentList.comments : null;
        next();
      } else {
        res.send({
          code: 404,
          message: '该文章不存在了！无法评论'
        })
      }
    } catch (e) {
      res.send({
        code: 500,
        message: '查找时报错了！'
      })
    }
  }
  // 评论区，处理请求
  async getArticleCommentById (req, res) {
    let { comments } = req;
    // 通过评论中的ueserId ,获取用户信息，添加到data中，往data里添加userName、userPic
    let data = await this.findUserInfoByUserId(comments);
    res.send({
      code: 200,
      comments: data,
      message: '查找成功，不过有没有数据不知道~'
    })
  }
  // 通过id获取子评论
  async getSubCommentById (req, res) {
    /*
      user 读取的当前登录用户的信息
      body 提交的内容
        参数
          id - 文章id，通过id获取comments列表
          commentId - 父评论的id
      comments 获的评论列表
    */
    let { body, comments } = req;
    let commentItem = comments.find(item => item.id === body.commentId);
    try {
      if (!!commentItem) {
        let data = await Promise.all(commentItem.children.map(async (id) => {
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
        }))
        res.send({
          code: 200,
          data,
          message: '查找成功'
        })
      } else {
        res.send({
          code: 404,
          data: null,
          message: '您要评论的对象已经将该评论删除，无法添加，请刷新后查看！'
        })
      }
    } catch (e) {
      res.send({
        code: 404,
        data: e,
        message: '您要评论的对象已经将该评论删除，无法添加，请刷新后查看！'
      })
    }

  }
  // 获取用户创建的文章
  async getUserArticles (req, res) {
    let { user } = req;
    try {
      // 能走到这里，说明用户名存在，否则上一层就拦截掉了
      let data = await articleIntroduceModel.find({
        username: user.username
      });
      res.send({
        code: 200,
        data,
        message: '查找成功！'
      })
    } catch (e) {
      res.send({
        code: 500,
        message: 'controller/getData.js - getUserArticles报错'
      })
    }
  }
}

export default new getDataController();
