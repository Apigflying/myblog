import express from 'express';
import userController from 'controller/user/user.js';
import deleteController from 'controller/deletes/deletes.js';
import getDataController from 'controller/getData/getData.js';
const router = express.Router();

// 删除文章
router.post(
  '/deleteArticleById',
  userController.verifyToken,
  getDataController.findArticleIntroduceById, // 获取文章简介
  getDataController.findArticleContentById, //  获取文章内容
  getDataController.findArticleCommentById, // 获取文章评论内容
  deleteController.deleteArticleById,
);
// 删除文章评论
/*
 * {
 *  id 文章的id
 *  commentId comment list item id
 * }
 */
router.post(
  '/deleteCommentById',
  userController.verifyToken,
  userController.findUserInfoByUserName, // 获取用户详细信息 （照片、用户名等）
  getDataController.findArticleCommentById,
  deleteController.deleteCommentById
)
// 删除子评论
/*
  id 文章id
  commentId 评论id
  childId 子评论的id
*/
router.post(
  '/deleteSubComment',
  userController.verifyToken,
  userController.findUserInfoByUserName, // 获取用户详细信息 （照片、用户名等）
  getDataController.findArticleCommentById,// 通过id查找评论
  deleteController.deleteSubComment,// 删除子评论
)
export default router;
