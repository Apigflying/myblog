import express from 'express';
import getDataController from 'controller/getData/getData.js';
import userController from 'controller/user/user.js';
const router = express.Router();

// 获取七牛云上传图片所需的key和token  - 需要加身份识别，只有登录用户才能调用该接口
router.get('/getUploadToken',getDataController.getUploadToken);
// getArticleById?id=5b8d030fb3ccb4ffb247af2c
// 获取所有文章列表
router.get('/getArticleList',getDataController.getArticleList);
// 通过文章id 查看文章详情
router.get(
  '/getArticleById',
  getDataController.findArticleIntroduceById, // 获取文章简介
  getDataController.findArticleContentById,// 获取文章的详细内容
  getDataController.getArticleById // 返回文章简介和文章详情
);
// 通过文章id获取文章评论内容
router.get(
  '/getArticleCommentById',
  getDataController.findArticleCommentById,
  getDataController.getArticleCommentById
)
// 通过id获取子评论列表
/*
  id - 文章id，通过id获取comments列表
  commentId - 父评论的id
*/
router.post(
  '/getSubCommentById',
  getDataController.findArticleCommentById,
  getDataController.getSubCommentById
)
// 获取用户的创建的所有文章
router.post(
  '/getUserArticles',
  userController.verifyToken,
  getDataController.getUserArticles
)
router.get(
  '/getUserWeather',
  getDataController.getUserWeather
)
router.get(
  '/getValidateCode',
  getDataController.getValidateCode
)
export default router;
