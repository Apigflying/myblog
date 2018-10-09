import express from 'express';
import userController from 'controller/user/user.js';
import createController from 'controller/create/create.js';
import getDataController from 'controller/getData/getData.js';
const router = express.Router();

// 创建 - 修改 文章简介
router.post(
  '/createArticleIntroduce',
  userController.verifyToken, //
  getDataController.findArticleIntroduceById, // 通过id查找文章简介
  createController.createArticleIntroduce, //如果简介存在，那么就更新简介
);
// 创建 - 修改 文章详情
router.post(
  '/createArticleContent',
  userController.verifyToken, // 验证用户授权信息
  getDataController.findArticleContentById, // 通过id查找文章内容
  createController.createArticleContent // 创建文章存在，更新文章内容，如果没有文章，创建文章
);
// 创建 - 评论
router.post(
  '/createArticleComment',
  userController.verifyToken, // 验证用户授权信息
  userController.findUserInfoByUserName, // 获取用户详细信息 （照片、用户名等）
  getDataController.findArticleCommentById, // 通过id查找文章评论列表
  createController.createArticleComment // 创建文章评论
)
// 创建 - 子评论
/*
  id - 文章id，通过id获取comments列表
  commentId - 父评论的id
  comments - 子评论的评论内容
  replyUserId - 回复对象的用户id
*/
router.post(
  '/createSubComment',
  userController.verifyToken, // 验证用户授权信息
  userController.findUserInfoByUserName, // 获取用户信息 （照片、用户名等）
  getDataController.findArticleCommentById, // 通过id查找文章评论列表
  createController.createSubComment, // 创建子评论
)

// 给评论点赞
router.post(
  '/setPraise',
  userController.verifyToken, // 验证用户授权信息
  userController.findUserInfoByUserName, // 获取用户信息 （照片、用户名等）
  getDataController.findArticleCommentById, // 通过id查找文章评论列表
  createController.setPraise // 创建文章评论
)

export default router;
